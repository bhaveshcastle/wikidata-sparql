'use strict'

const Promise       = require('bluebird') ;
const config        = require('../config.js')             ;
const postgres      = require('../db/postgres.js')      ;
const error_handler = require('../misc/error_handler.js') ;
const CustomError   = require('../misc/custom_error.js')  ;


module.exports = Promise.coroutine(function* (params) {
  const {
    label_name
    , ds_type
  } = params;

  if (!label_name) { return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS)); }
  if (!ds_type) { return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS)); }

  const already_exist = yield Promise.using(postgres.getConnection()
    , conn => {
      return conn.query(`SELECT * FROM ds_label
                        WHERE label = lower($<name>)
                        AND type = $<ds_type>`
        , { ds_type, name: label_name });
    });

  if (already_exist && already_exist.length) {
    return Promise.reject(new CustomError(error_handler.RECORD_ALREADY_EXISTS));
  }

  const create = yield Promise.using(postgres.getConnection()
    , conn => {
      return conn.query(`INSERT INTO ds_label(label, type)
                        VALUES(lower($<name>), $<type>)
                        RETURNING id, label, type`
        , { name: label_name, type: ds_type });
    });

  if (!create || create.length < 1) {
    return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
  }

  return create[0];

});