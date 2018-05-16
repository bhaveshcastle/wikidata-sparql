'use strict';

const router                        = require('koa-router')();
const send                          = require('koa-send');

const web_middleware                = require('./middleware/web.js') ;
const form_parser                   = require('./middleware/form_parser.js');


router.post('/api/v1/query', form_parser(), web_middleware, require('./requests/query.js'));

router.get('/api/v1/get_all_datasets', form_parser(), web_middleware, require('./requests/get_all_datasets.js'));
router.get('/api/v1/get_all_labels', form_parser(), web_middleware, require('./requests/get_all_labels.js'));

router.post('/api/v1/create_dataset', form_parser(), web_middleware, require('./requests/create_dataset.js'));
router.post('/api/v1/create_label', form_parser(), web_middleware, require('./requests/create_label.js'));
//router.get('/api/v1/fetch_dataset', form_parser(), web_middleware, require('./requests/fetch_dataset.js'));


router.get('/', function* () {
  yield send(this, __dirname + '/../../client/app/index.html');
});

module.exports = router ;