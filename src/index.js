'use strict'

const stringify = require('pull-stringify')
const split = require('pull-split')

exports = module.exports

exports.parse = () => {
  return split('\n', JSON.parse, false, true)
}

exports.serialize = stringify.ldjson
