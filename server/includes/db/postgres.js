'use strict'

const config  = require('../config.js') ;

const Promise = require('bluebird') ;

const pgp     = require('pg-promise')( { promiseLib : Promise, pgNative : config.POSTGRES_NATIVE } ) ;

function Postgres() {
  this.pg_config = { host       : config.POSTGRES_HOSTNAME
                   , port       : config.POSTGRES_PORT
                   , database   : config.POSTGRES_DB
                   , user       : config.POSTGRES_USER
                   , password   : config.POSTGRES_PASS
                   , poolSize   : config.POSTGRES_POOLSIZE } ;

  this.pg = pgp(this.pg_config);
}

Postgres.prototype.getConnection = function() {
  let connection;

  return Promise.resolve(this.pg.connect())
     .then(conn => {
      connection = conn;
      return conn;
  } ).catch(e => {
    throw e ;
  } ).disposer(() => {
    if (connection) {
      connection.done();
    }
  } ) ;
} ;

module.exports = new Postgres() ;
