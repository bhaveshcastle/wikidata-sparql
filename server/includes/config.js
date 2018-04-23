'use strict'

const argv                        = require('minimist')(process.argv.slice(2));

const config = {};

config.PORT = 3000;

config.corsOptions = {
  origin : '*'
}

module.exports                    = config ;