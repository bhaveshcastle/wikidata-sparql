'use strict';

module.exports = function CustomError(error_code) {
  Error.captureStackTrace(this, this.constructor);
  this.name       = this.constructor.name;
  this.error_code = error_code;
};

require('util').inherits(module.exports, Error);