'use strict';

const _get_all_labels = require('../../includes/dataset/get_all_labels.js');      

module.exports = function* (next) {
  const labels = yield _get_all_labels({
    dataset_id: this._request.variables.type
  });
  this.body = {
    data: labels
    , return_code: 0
  };
  yield next;
};