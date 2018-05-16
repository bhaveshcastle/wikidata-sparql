'use strict'

const Promise       = require('bluebird') ;
const config        = require('../config.js')             ;
const postgres      = require('../db/postgres.js')      ;
const error_handler = require('../misc/error_handler.js') ;
const CustomError   = require('../misc/custom_error.js')  ;


module.exports = Promise.coroutine(function* (params) {
  const {
    dataset_name
  } = params;

  if (!dataset_name) { return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS)); }
  
  const already_exist = yield Promise.using(postgres.getConnection()
    , conn => {
      return conn.query(`SELECT * FROM ds_type
                        WHERE name = lower($<name>)`
        , { name: dataset_name });
    });

  if (already_exist && already_exist.length) {
    return Promise.reject(new CustomError(error_handler.RECORD_ALREADY_EXISTS));
  }

  const create = yield Promise.using(postgres.getConnection()
    , conn => {
      return conn.query(`INSERT INTO ds_type(name)
                        VALUES(lower($<name>))
                        RETURNING id, name`
        , { name: dataset_name });
    });

  if (!create || create.length < 1) {
    return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
  }

  return create[0];

});