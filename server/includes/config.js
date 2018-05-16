'use strict'

const Promise = require('bluebird') ;
const argv                        = require('minimist')(process.argv.slice(2));

const config = {};

config.PORT = 3000;

config.POSTGRES_HOSTNAME          = argv.postgres_hostname || 'localhost' ;
config.POSTGRES_PORT              = argv.postgres_port     || '5432'                           ;
config.POSTGRES_USER              = argv.postgres_username || 'ds_user'                     ;
config.POSTGRES_PASS              = argv.postgres_password || 'ds_pass'             ;
config.POSTGRES_DB                = argv.postgres_database || 'ds'                          ;
config.POSTGRES_POOLSIZE          = argv.postgres_poolsize || 10                               ;
config.POSTGRES_NATIVE            = argv.postgres_native ? argv.postgres_native === 'true' : true           ;
config.POSTGRES_CONNECTION_STRING = `pg://${config.POSTGRES_USER}:${config.POSTGRES_PASS}@${config.POSTGRES_HOSTNAME}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`


config.corsOptions = {
  origin : '*'
}

Promise.promisifyAll(require('request'), { multiArgs: true });

module.exports                    = config ;