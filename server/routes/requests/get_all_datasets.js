'use strict';

const _get_all_datasets = require('../../includes/dataset/get_all_datasets.js');      

module.exports = function* (next) {
  const datasets = yield _get_all_datasets();
  this.body = {
    data: datasets
    , return_code: 0
  };
  yield next;
};