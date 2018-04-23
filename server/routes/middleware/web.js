'use strict'

const Request = require('../request.js') ;
const config        = require('../../includes/config.js') ;

const handle_request = function*(next) {
  const _request_params           = { } ;
  _request_params.ip              = this.request.ip ;

  if(_request_params.ip.substr(0, 7) == "::ffff:") {
    _request_params.ip = _request_params.ip.substr(7)
  }
  
  _request_params.variables             = this.request && this.request.method === 'GET' ? this.request.query : this.request.body ;
  _request_params.files                 = this.request && this.request.files ;

  const _request                        = new Request( _request_params ) ;
  this._request                         = _request ;

  yield next ;
} ;

module.exports = handle_request ;