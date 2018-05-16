'use strict';

const _insert_data = require('../../includes/dataset/insert_data.js');      

module.exports = function* (next) {
  yield _insert_data({
    image_url: this._request.variables.url
    , labels: this._request.variables.labels
    , ds_type: this._request.variables.ds_type
  });
  this.body = {
    return_code: 0
  };
  yield next;
};