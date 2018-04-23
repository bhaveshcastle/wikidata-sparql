'use strict';

const router                        = require('koa-router')();
const send                          = require('koa-send');

const web_middleware                = require('./middleware/web.js') ;
const form_parser                   = require('./middleware/form_parser.js');


router.post('/api/v1/query', form_parser(), web_middleware, require('./requests/query.js'));


router.get('/', function* () {
  yield send(this, __dirname + '/../../client/app/index.html');
});

module.exports = router ;