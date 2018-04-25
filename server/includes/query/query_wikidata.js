'use strict'

const Promise       = require('bluebird') ;
const request       = require('request')  ;
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
  ?item 
  (?itemLabel AS ?itemText)
  (GROUP_CONCAT(DISTINCT ?awardLabel; SEPARATOR = ", ") AS ?awards) 
  (?genderLabel AS ?genderText)
  (GROUP_CONCAT(DISTINCT ?image; SEPARATOR = ", ") AS ?images) 
  ?description 
  (COUNT(DISTINCT ?test) AS ?langPages)
  ?sitelinks
  WHERE {
    ?item wdt:P31 wd:Q5.
    ?item rdfs:label "${person_name}"@en.
    OPTIONAL { ?item wdt:P166 ?award. }
    OPTIONAL { ?item wdt:P21 ?gender. }
    OPTIONAL { ?item wdt:P18 ?image. }
    OPTIONAL { ?item schema:description ?description. }
    OPTIONAL { ?item schema:description ?test. }
    OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }
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
  GROUP BY ?item ?itemLabel ?gender ?genderLabel ?description ?wikipedia ?langPages ?sitelinks
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
  ?item 
  (?itemLabel AS ?itemText)
  (GROUP_CONCAT(DISTINCT ?image; SEPARATOR = ", ") AS ?images) 
  ?description 
  (COUNT(DISTINCT ?test) AS ?langPages)
  ?sitelinks
  WHERE {
    ?item wdt:P31 wd:Q4830453.
    ?item rdfs:label "${brand_name}"@en.
    OPTIONAL { ?item wdt:P166 ?award. }
    OPTIONAL { ?item wdt:P21 ?gender. }
    OPTIONAL { ?item wdt:P18 ?image. }
    OPTIONAL { ?item schema:description ?description. }
    OPTIONAL { ?item schema:description ?test. }
    OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }
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
  GROUP BY ?item ?itemLabel ?gender ?genderLabel ?description ?wikipedia ?langPages ?sitelinks
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

  let url;

  if (type == 1) {
    url = yield search_person_url({ person_name: searchParam });
  } else if (type == 2) {
    url = yield search_brand_url({ brand_name: searchParam });
  } else {
    return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS));
  }

  const [_res, _body] = yield request.getAsync(url);
  
  if (!_res || !_body) {
    return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
  }

  return {
    data: wdk.simplifySparqlResults(_body)
  };

});
