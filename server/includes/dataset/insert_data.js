'use strict'

const Promise       = require('bluebird') ;
const config        = require('../config.js')             ;
const postgres      = require('../db/postgres.js')      ;
const error_handler = require('../misc/error_handler.js') ;
const CustomError   = require('../misc/custom_error.js')  ;


module.exports = Promise.coroutine(function* (params) {
  const {
    image_url
    , labels: _labels
    , ds_type
  } = params;

  if (!image_url) { return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS)); }
  if (!ds_type) { return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS)); }
  if (!_labels) { return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS)); }

  let labels;
  try {
    labels = JSON.parse(_labels);
  } catch (error) {
    return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS));
  }
  
  let query_values = `VALUES($<image_url>, $<ds_type>, ${labels[0]})`;
  for (let i = 1; i < labels.length; i++) {
    query_values += `, ($<image_url>, $<ds_type>, ${labels[i]})`
  }

  yield Promise.using(postgres.getConnection()
    , conn => {
      return conn.query(`INSERT INTO ds_image_data(image_url, type, label_id)
                        ${query_values}`
        , { image_url, ds_type });
    }).catch(err => {
      console.error('Error saving data ', err);
      return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
    });


});