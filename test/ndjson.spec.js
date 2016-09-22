/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const pull = require('pull-stream')
const ndjson = require('../src')

describe('pull-ndjson', () => {
  it('serialize and parses one valid json object', (done) => {
    pull(
      pull.values([
        { a: 1 }
      ]),
      ndjson.serialize(),
      ndjson.parse(),
      pull.drain((data) => {
        expect(data).to.eql({ a: 1 })
      }, done)
    )
  })
  it('serializes and parses several valid json object', (done) => {
    const values = [
      { a: 1 },
      { b: 2 },
      { c: 3 },
      { d: 4 },
      { e: 5 },
      { b: 6 }
    ]

    pull(
      pull.values(values),
      ndjson.serialize(),
      ndjson.parse(),
      pull.collect((err, data) => {
        expect(err).to.not.exist
        expect(data).to.eql(values)
        done()
      })
    )
  })

  it('fails to parse invalid data', (done) => {
    pull(
      pull.values([
        new Buffer('hey')
      ]),
      ndjson.parse(),
      pull.collect((err, data) => {
        expect(err).to.exist
        expect(data).to.be.empty
        done()
      })
    )
  })
})
