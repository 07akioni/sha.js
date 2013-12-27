
var vectors = require('./nist-vectors.json')
var tape = require('tape')
var from = require('bops/typedarray/from')
var hexpp = require('../hexpp')

var Sha1 = require('../')
var Sha256 = require('../sha256')

function createHash(alg) {
  return (
      'sha1'   == alg ? new Sha1()
    : 'sha256' == alg ? new Sha256()
    : (function () { throw new Error(alg + ' is not supported') }) ()
  )
}

function makeTest(alg, i, verbose) {
  var v = vectors[i]
  
  tape(alg + ': NIST vector ' + i, function (t) {
    if(verbose) {
      console.log(v)
      console.log('VECTOR', i)
      console.log('INPUT', v.input)
      console.log(hexpp(from(v.input, 'base64')))
      console.log(new Buffer(v.input, 'base64').toString('hex'))
    }
    var buf = from(v.input, 'base64')
//    console.log(createHash(alg).update(buf))
    t.equal(createHash(alg).update(buf).digest('hex'), v[alg])
    t.end()
  })
  
}

if(process.argv[2])
  makeTest(process.argv[2], parseInt(process.argv[3]), true)
else
  vectors.forEach(function (v, i) {
    makeTest('sha1', i)
    makeTest('sha256', i)
  })


