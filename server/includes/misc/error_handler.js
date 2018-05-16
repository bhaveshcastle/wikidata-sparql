'use strict'

const error_handler = { } ;

// General Error Codes
error_handler.SUCCESS                           =     0 ;
error_handler.ERROR_UNKNOWN                     =     1 ;
error_handler.RECORD_NOT_FOUND                  =     2 ;
error_handler.RECORD_ALREADY_EXISTS             =     3 ;
error_handler.INVALID_ARGUMENTS                 =    10 ;

module.exports = error_handler ;