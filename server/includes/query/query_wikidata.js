'use strict'

const Promise       = require('bluebird') ;
const request       = require('request')  ;
const numeral       = require('numeral')  ;
const wdk           = require('wikidata-sdk');
const config        = require('../config.js')             ;
const error_handler = require('../misc/error_handler.js') ;
const CustomError   = require('../misc/custom_error.js')  ;


const search_person_url = Promise.coroutine(function* (params) {
  const {
    person_name
  } = params;

  const sparql_query = `
  SELECT
  (?Freebase_ID AS ?MID)
  (?itemLabel AS ?Name)
  (GROUP_CONCAT(DISTINCT ?awardLabel; SEPARATOR = ", ") AS ?Awards) 
  (?genderLabel AS ?Gender)
  (GROUP_CONCAT(DISTINCT ?image; SEPARATOR = ",") AS ?Images) 
  (?description AS ?Description)
  (COUNT(DISTINCT ?test) AS ?LanguagePagesInWikibase)
  (?sitelinks AS ?SiteLinksInWikibase)
  WHERE {
    ?item wdt:P31 wd:Q5.
    ?item rdfs:label "${person_name}"@en.
    OPTIONAL { ?item wdt:P166 ?award. }
    OPTIONAL { ?item wdt:P21 ?gender. }
    OPTIONAL { ?item wdt:P18 ?image. }
    OPTIONAL { ?item schema:description ?description. }
    OPTIONAL { ?item schema:description ?test. }
    OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }
    OPTIONAL { ?item wdt:P646 ?Freebase_ID. }
    SERVICE wikibase:label {
      bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
      ?award rdfs:label ?awardLabel.
      ?gender rdfs:label ?genderLabel.
      ?item rdfs:label ?itemLabel.
      ?imported_from rdfs:label ?imported_fromLabel .
      ?test rdfs:label ?testLabel .
    }
    FILTER((LANG(?description)) = "en")
    OPTIONAL { ?item wdt:P143 ?imported_from. }
  }
  GROUP BY ?Freebase_ID ?itemLabel ?gender ?genderLabel ?description ?sitelinks
  `;

  const url = wdk.sparqlQuery(sparql_query);

  return url;
});

const search_brand_url = Promise.coroutine(function* (params) {
  const {
    brand_name
  } = params;

  const sparql_query = `
  SELECT
  (?Freebase_ID AS ?MID) 
  (?itemLabel AS ?Name)
  (GROUP_CONCAT(DISTINCT ?image; SEPARATOR = ",") AS ?Images) 
  (?description AS ?Description) 
  (?logo AS ?Logo)
  (?employees AS ?NumEmployees)
  (?total_revenue AS ?TotalRevenue)
  (COUNT(DISTINCT ?test) AS ?LanguagePagesInWikibase)
  (?sitelinks AS ?SiteLinksInWikibase)
  WHERE {
    ?item wdt:P31 wd:Q4830453.
    ?item rdfs:label "${brand_name}"@en.
    OPTIONAL { ?item wdt:P154 ?logo. }
    OPTIONAL { ?item wdt:P1128 ?employees. }
    OPTIONAL { ?item wdt:P2139 ?total_revenue. }
    OPTIONAL { ?item wdt:P18 ?image. }
    OPTIONAL { ?item schema:description ?description. }
    OPTIONAL { ?item schema:description ?test. }
    OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }
    OPTIONAL { ?item wdt:P646 ?Freebase_ID. }
    SERVICE wikibase:label {
      bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
      ?item rdfs:label ?itemLabel.
      ?imported_from rdfs:label ?imported_fromLabel .
      ?test rdfs:label ?testLabel .
    }
    FILTER((LANG(?description)) = "en")
    OPTIONAL { ?item wdt:P143 ?imported_from. }
  }
  GROUP BY ?Freebase_ID ?itemLabel ?gender ?genderLabel ?description ?sitelinks ?logo ?employees ?total_revenue
  `;

  const url = wdk.sparqlQuery(sparql_query);

  return url;
});

module.exports = Promise.coroutine(function* (params) {
  const {
    type, // 1 - Person, 2 - Brand
    searchParam
  } = params;
  if (!searchParam || type == undefined) {
    return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS));
  }

  const refinedSearchParam = searchParam.replace(/\w+/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }).replace(/\s+/g, ' ').trim();

  let url;

  if (type == 1) {
    url = yield search_person_url({ person_name: refinedSearchParam });
  } else if (type == 2) {
    url = yield search_brand_url({ brand_name: refinedSearchParam });
  } else {
    return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS));
  }

  const [_res, _body] = yield request.getAsync(url);
  
  if (!_res || !_body) {
    return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
  }
  let parsedResult;
  try {
    parsedResult = wdk.simplifySparqlResults(_body);
  } catch (err) {
    console.log(err);
    return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
  }
  parsedResult.map((row) => {
    if (row.MID) {
      row.MID = row.MID.substr(1).replace('/', '.')
    }
  });
  if (type == 2) { // Only for brand
    parsedResult.map((row) => {
      row.TotalRevenue = row.TotalRevenue > 0 ? '$' + numeral(row.TotalRevenue).format('0,0') : '-';
      row.NumEmployees = row.NumEmployees > 0 ? numeral(row.NumEmployees).format('0,0') : '-';
    })
  }
  return {
    data: parsedResult
  };

});
