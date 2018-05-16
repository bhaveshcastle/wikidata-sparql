'use strict';

const _create_label = require('../../includes/dataset/create_label.js');      

module.exports = function* (next) {
  const _create = yield _create_label({
    label_name: this._request.variables.label
    , ds_type: this._request.variables.ds_type
  });
  this.body = {
    data: _create
    , return_code: 0
  };
  yield next;
};