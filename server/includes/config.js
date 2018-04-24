'use strict'

const Promise = require('bluebird') ;
const argv                        = require('minimist')(process.argv.slice(2));

const config = {};

config.PORT = 3000;

config.corsOptions = {
  origin : '*'
}

Promise.promisifyAll(require('request'), { multiArgs: true });

module.exports                    = config ;