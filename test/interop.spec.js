/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const pull = require('pull-stream')
const pair = require('pull-pair')
const toStream = require('pull-stream-to-stream')
const ndjsonPull = require('../src')
const ndjsonStream = require('ndjson')

describe('interop', () => {
  it('ndjsonStream serialize -> ndjsonPull parse', (done) => {
    const values = [
      { a: 1 },
      { b: 2 },
      { c: 3 },
      { d: 4 },
      { e: 5 },
      { b: 6 }
    ]

    const p = pair()

    const writable = toStream.sink(p.sink)
    const serialize = ndjsonStream.serialize()
    serialize.pipe(writable)
    values.forEach((v) => { serialize.write(v) })
    serialize.end()

    pull(
      p.source,
      ndjsonPull.parse(),
      pull.collect((err, data) => {
        expect(err).to.not.exist
        expect(data).to.eql(values)
        done()
      })
    )
  })

  it('ndjsonPull serialize -> ndjsonStream parse', (done) => {
    const values = [
      { a: 1 },
      { b: 2 },
      { c: 3 },
      { d: 4 },
      { e: 5 },
      { b: 6 }
    ]

    const p = pair()

    pull(
      pull.values(values),
      ndjsonPull.serialize(),
      p.sink
    )

    const readable = toStream.source(p.source)
    const chunks = []
    readable
      .pipe(ndjsonStream.parse())
      .on('data', (chunk) => {
        chunks.push(chunk)
      })
      .on('end', () => {
        expect(chunks).to.eql(values)
        done()
      })
  })
})
