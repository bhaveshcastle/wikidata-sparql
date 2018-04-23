'use strict';

//const _refund_token = require('../../../includes/admin/refund_token.js');      

module.exports = function* (next) {
  /* yield _refund_token({
    username: this.melon_request.variables.username,
    refund_tokens: this.melon_request.variables.tokens,
    admin_user_id: this.melon_request.user_id
  }); */
  this.body = {
    return_code: 0
  };
  yield next;
};