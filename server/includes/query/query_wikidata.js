'use strict'

const Promise       = require('bluebird') ;
const request       = require('request')  ;
const wdk           = require('wikidata-sdk');
const config        = require('../config.js')             ;
const error_handler = require('../misc/error_handler.js') ;
const CustomError   = require('../misc/custom_error.js')  ;

module.exports = Promise.coroutine(function* (params) {
  const {
    type, // 1 - Person, 2 - Brand
    searchParam
  } = params;

  if (!searchParam || type == undefined) {
    return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
  }

  // Fetching person data
  const sparql_query = `
  SELECT ?itemLabel 
  (GROUP_CONCAT(DISTINCT ?awardLabel; SEPARATOR = ", ") AS ?awards) 
  ?genderLabel 
  (GROUP_CONCAT(DISTINCT ?image; SEPARATOR = ", ") AS ?images) 
  ?description 
  (COUNT(DISTINCT ?test) AS ?langCount)  
  (sum(if(strlen(str(?testLabel)) > 4, 1, 0)) as ?conditionCount)
  ?sitelinks
  ?stated_in 
  WHERE {
    ?item wdt:P31 wd:Q5.
    ?item rdfs:label "${searchParam}"@en.
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
  GROUP BY ?itemLabel ?gender ?genderLabel ?description ?wikipedia ?langCount ?stated_in ?sitelinks
  `;

  const url = wdk.sparqlQuery(sparql_query);

  const [_res, _body] = yield request.getAsync(url);
  
  if (!_res || !_body) {
    return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
  }

  return {
    data: JSON.parse(_body)
  };

});
