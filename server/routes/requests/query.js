'use strict';

const _query_wikidata = require('../../includes/query/query_wikidata.js');      

module.exports = function* (next) {
  const _query_result = yield _query_wikidata({});
  this.body = {
    data : _query_result.data
    , return_code: 0
  };
  yield next;
};