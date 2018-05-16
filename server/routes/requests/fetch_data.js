'use strict';

const _fetch_data = require('../../includes/dataset/fetch_data.js');      

module.exports = function* (next) {
  const _data = yield _fetch_data({
    labels: this._request.variables.labels
    , ds_type: this._request.variables.ds_type
    , page_size: this._request.variables.page_size
    , reference: this._request.variables.reference
    , sorting_order: this._request.variables.sorting_order
    , offset_type: this._request.variables.offset_type
  });
  this.body = {
    data: _data
    , return_code: 0
  };
  yield next;
};