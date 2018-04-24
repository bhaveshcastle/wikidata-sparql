'use strict';

const _query_wikidata = require('../../../includes/query/query_wikidata.js');      

module.exports = function* (next) {
  
  this.body = {
    return_code: 0
  };
  yield next;
};