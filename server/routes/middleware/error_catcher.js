'use strict'

const config            = require('../../includes/config.js')                   ;
const error_handler     = require('../../includes/misc/error_handler.js')       ;
const CustomError        = require('../../includes/misc/custom_error.js')       ;

const error_catcher = function*(next) {
  this.error_user_id ;
  this.error_language ;
  try {
    yield* next;
  } catch (err) {
    const _error = err;
    this.error(err);
    if(!(err instanceof CustomError)) {
      err = new CustomError(error_handler.ERROR_UNKNOWN);    
    }
    try {
      /* if(err.error_code === error_handler.AUTHENTICATION_REQUIRED) {
        this.status = 401 ; // 401 -- Unauthorized
      } else {
        this.status = 400 ; // 400 -- Bad Request
      } */

      this.status = 400 ; // 400 -- Bad Request
      this.body = {
        return_code : err.error_code
      } ;

    } catch(_err) {
      err = _err ;
    }
  }
} ;

module.exports = error_catcher ;
