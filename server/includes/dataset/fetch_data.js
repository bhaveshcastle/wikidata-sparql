'use strict'

const Promise       = require('bluebird') ;
const config        = require('../config.js')             ;
const postgres      = require('../db/postgres.js')      ;
const error_handler = require('../misc/error_handler.js') ;
const CustomError   = require('../misc/custom_error.js')  ;


module.exports = Promise.coroutine(function* (params) {
  const {
    labels: _labels
    , ds_type
    , page_size
    , reference
    , sorting_order
    , offset_type
  } = params;

  if (!ds_type) { return Promise.reject(new CustomError(error_handler.INVALID_ARGUMENTS)); }

  let allowed_sorting_types = ['ASC', 'DESC'];

  if(allowed_sorting_types.indexOf(sorting_order) === -1){
      console.error("Invalid sorting order from client");
      return Promise.reject(new CustomError( error_handler.ERROR_UNKNOWN ) ) ;
  }

  let allowed_offset_types = ['prev', 'next'];

  if(allowed_offset_types.indexOf(offset_type) === -1){
      console.error("Invalid offset type from client");
      return Promise.reject(new CustomError( error_handler.ERROR_UNKNOWN ) ) ;
  }

  let labels = [];
  try {
    labels = JSON.parse(_labels);
  } catch (error) {
    console.error('Error in parsing labels');
  }
  
  let where_clause = '';
  if (labels.length > 0) {
    where_clause += `AND (label_id = ${labels[0]}`;
    for (let i = 1; i < labels.length; i++) {
      where_clause += `OR label_id = ${labels[i]}`;
    }
    where_clause += `)`;
  }

  let data = [];
  if (offset_type === 'next') {
    data = yield Promise.using(postgres.getConnection()
    , conn => {
      return conn.query(`SELECT id
                        , image_url
                        , label_id
                        , created_at
                        , updated_at
                        FROM ds_image_data
                        WHERE CASE WHEN $<sorting_order> = 'ASC' THEN id > $<reference>
                        WHEN $<sorting_order> = 'DESC' THEN id < $<reference>
                        END
                        AND type = $<ds_type>
                        ${where_clause}
                        ORDER BY id ${sorting_order}
                        LIMIT $<page_size>`
        , { ds_type, page_size, sorting_order, reference });
    }).catch(err => {
      console.error('Error fetching data ', err);
      return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
    });
  } else {
    data = yield Promise.using(postgres.getConnection()
    , conn => {
      return conn.query(`SELECT id
                        , image_url
                        , label_id
                        , created_at
                        , updated_at
                        FROM ds_image_data
                        WHERE CASE WHEN $<sorting_order> = 'ASC' THEN id < $<reference>
                        WHEN $<sorting_order> = 'DESC' THEN id > $<reference>
                        END
                        AND type = $<ds_type>
                        ${where_clause}
                        ORDER BY id ${sorting_order}
                        LIMIT $<page_size>`
        , { ds_type, page_size, sorting_order, reference });
    }).catch(err => {
      console.error('Error fetching data ', err);
      return Promise.reject(new CustomError(error_handler.ERROR_UNKNOWN));
    });
  }
  
  return data;

});