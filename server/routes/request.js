'use strict'

const Promise                     = require('bluebird')                                           ;

const CustomError                 = require('../includes/misc/custom_error.js')                    ;
const error_handler               = require('../includes/misc/error_handler.js')                  ;

function Request( { variables, files } ) {
  
  this.variables = variables;
  this.files = files;
  
} ;

module.exports = Request ;