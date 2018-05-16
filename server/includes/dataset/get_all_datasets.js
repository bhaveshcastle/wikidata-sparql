'use strict'

const Promise       = require('bluebird') ;
const config        = require('../config.js')             ;
const postgres      = require('../db/postgres.js')      ;
const error_handler = require('../misc/error_handler.js') ;
const CustomError   = require('../misc/custom_error.js')  ;


module.exports = Promise.coroutine(function* () {
  
  let datasets = yield Promise.using(postgres.getConnection()
    , conn => {
      return conn.query(`SELECT id, name AS dataset_name FROM ds_type ORDER BY name`
        , { });
    });

  if (!datasets) {
    return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
  }

  if(datasets.length < 1) {
    datasets = [];
  }
  return datasets;

});