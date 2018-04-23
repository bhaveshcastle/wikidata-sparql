'use strict'

const config        = require('./includes/config')                          ;

// Need to define the form parser

const Koa           = require('koa')                                        ;
const koaLogger     = require('koa-logger')                                 ;
const cors          = require('koa-cors')                                   ;
const argv          = require('minimist')(process.argv.slice(2))            ;
const serve         = require('koa-static')                                 ;

const error_catcher = require('./routes/middleware/error_catcher.js')       ;

const router = require('./routes/routes.js');

const init = function(app) {
  app.proxy           = true ;

  app.use(serve(__dirname + '/../client/app'))
  app.use(error_catcher)
      .use(koaLogger())
      .use(router.routes())
      .use(router.allowedMethods())
      .use(cors(config.corsOptions));
};


const app = new Koa();
const server = require('http2').createServer(app.callback());
init(app);
app.listen(config.PORT);
console.log("Starting http server")
