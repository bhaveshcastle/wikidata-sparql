'use strict';
   

module.exports = function* (next) {

  this.body = {
    return_code: 0
  };
  yield next;
};