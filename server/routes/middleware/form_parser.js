'use strict'

const Promise    = require('bluebird')     ;

const _          = require('lodash')       ;
const fs         = require('fs')           ;
const formidable = require('formidable')   ;
const bytes      = require('bytes')        ;

const config     = require('../../includes/config');

const form_parser = function(opts, extra_opts) {
  extra_opts = extra_opts || {}
  opts = opts || {}
  _.merge(opts, extra_opts)

  return function *formidable(next) {
    const res = yield form_parser.parse(opts, this)

    this.request.body  = res.fields
    this.request.files = res.files

    try {
      yield* next
    } finally {
      yield Promise.all(_.map(res.files, file => {
        return fs.unlinkAsync(file.path)
      }))
    }
  }
}

form_parser.parse = function(opts, ctx) {

  if (!ctx) {
    ctx = opts
    opts = {}
  }
  let maxBytes   = config.MAX_BYTES ;
  if(opts.maxBytes){
    maxBytes = opts.maxBytes;
  }

  return function(done) {
    const form    = new formidable.IncomingForm()
    form.encoding = 'binary'
    
    const files   = [ ]

    function bailAndCleanup(toClean, err, cb) {
      ctx.error(err) ;
      return Promise.map(toClean, fs.unlinkAsync).finally(() => {
        return cb(err)
      })
    }

    form.on('progress', (receivedBytes, expectedBytes) => {
      ctx.log('file progress: ', receivedBytes, '/', expectedBytes);
      if (receivedBytes > maxBytes || expectedBytes > maxBytes) {
        ctx.throw('Form exceeds max size limit', 413)
      }
    })

    form.on('fileBegin', (name, file) => {
      ctx.log('fileBegin: ', name, file);
      files.push(file.path)
    })

    form.parse( ctx.req
              , function(err, fields, files) {
      if (err) {
        return bailAndCleanup(files, err, done)
      }

      done(null, { fields: fields, files: files })
    })
  }
}

module.exports = form_parser ;