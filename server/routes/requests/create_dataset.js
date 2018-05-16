'use strict';

const _create_dataset = require('../../includes/dataset/create_dataset.js');      

module.exports = function* (next) {
  const _create = yield _create_dataset({
    dataset_name: this._request.variables.dataset_name
  });
  this.body = {
    data: _create
    , return_code: 0
  };
  yield next;
};