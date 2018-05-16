'use strict'

const Promise       = require('bluebird') ;
const config        = require('../config.js')             ;
const postgres      = require('../db/postgres.js')      ;
const error_handler = require('../misc/error_handler.js') ;
const CustomError   = require('../misc/custom_error.js')  ;


module.exports = Promise.coroutine(function* (params) {
  const {
    dataset_id
  } = params;

  let dataset_filter = '';
  if (dataset_id) {
    dataset_filter = `WHERE type = ${dataset_id}`;
  }
  
  let labels = yield Promise.using(postgres.getConnection()
    , conn => {
      return conn.query(`SELECT id, label, type
                        FROM ds_label 
                        ${dataset_filter}
                        ORDER BY label`
        , { });
    });

  if (!labels) {
    return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
  }

  if (labels.length < 1) {
    labels = [];
  }

  return labels;

});