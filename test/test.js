'use strict'
var assert = require('chai').assert
var path = require('path')
var fs = require('fs')

global.__base = path.join(__dirname, '..', '/')

var savePath = path.join(__dirname, 'etcd.json')
describe('Etcd test', function () {
  var Etcd = require(path.join(__base, 'src/server.js'))
  var EtcdWorker = new Etcd({
    savePath: savePath
  })
  var EtcdWorker3 = new Etcd({
    port: 2381
  })

  it('Start / Stop server', function (done) {
    EtcdWorker.start(function (host, port) {
      assert.equal(host, '127.0.0.1')
      assert.equal(port, 2379)

      var EtcdWorker2 = new Etcd({
        port: 2380,
        savePath: savePath
      })

      EtcdWorker2.start(function (host, port) {
        assert.equal(host, '127.0.0.1')
        assert.equal(port, 2380)
        EtcdWorker3.start(function (host, port) {
          assert.equal(host, '127.0.0.1')
          assert.equal(port, 2381)
          done()
        })
      })
    })
  })
  it('Save', function (done) {
    EtcdWorker.save(function (err) {
      assert(!err)
      done()
    })
  })
})

describe('Client test', function () {
  var Client = require(path.join(__base, 'src/client.js'))
  var ClientWorker = new Client()

  it('Set key=value', function (done) {
    ClientWorker.set('key', 'value', function (data) {
      assert.equal(data.code, 200)
      assert.equal(data.data.key, 'key')
      assert.equal(data.data.value, 'value')
      done()
    })
  })

  it('Set null=value', function (done) {
    ClientWorker.set(null, 'value', function (data) {
      assert.equal(data.code, 400)
      done()
    })
  })

  it('Get key', function (done) {
    ClientWorker.get('key', function (data) {
      assert.equal(data.code, 200)
      assert.equal(data.data.key, 'key')
      assert.equal(data.data.value, 'value')
      done()
    })
  })

  it('Get unknown', function (done) {
    ClientWorker.get('unknown', function (data) {
      assert.equal(data.code, 204)
      done()
    })
  })

  it('Get null', function (done) {
    ClientWorker.get(null, function (data) {
      assert.equal(data.code, 400)
      done()
    })
  })

  it('Set key.test.dsqdqs=value', function (done) {
    ClientWorker.set('key.test.dsqdqs', 'value', function (data) {
      assert.equal(data.code, 200)
      assert.equal(data.data.key, 'key.test.dsqdqs')
      assert.equal(data.data.value, 'value')
      done()
    })
  })

  it('Set key.test.dsqdz=value', function (done) {
    ClientWorker.set('key.test.dsqdz', 'value', function (data) {
      assert.equal(data.code, 200)
      assert.equal(data.data.key, 'key.test.dsqdz')
      assert.equal(data.data.value, 'value')
      done()
    })
  })

  it('Find /key.*/', function(done){
    ClientWorker.find('/key.*/', function(data){
      assert.equal(data.code, 200)
      assert.equal(data.data.regex, '/key.*/')
      assert.equal(data.data.value["key.test.dsqdqs"], 'value')
      assert.equal(data.data.value["key.test.dsqdz"], 'value')
      done()
    })
  })

  it('Delete key', function (done) {
    ClientWorker.delete('key', function (data) {
      assert.equal(data.code, 200)
      assert.equal(data.data.key, 'key')
      assert.equal(data.data.value, 'value')
      done()
    })
  })

  it('Delete unknown', function (done) {
    ClientWorker.delete('unknown', function (data) {
      assert.equal(data.code, 204)
      done()
    })
  })

  it('Delete null', function (done) {
    ClientWorker.delete(null, function (data) {
      assert.equal(data.code, 400)
      done()
    })
  })
})

describe('Cleanup', function () {
  it('Remove etcd.json', function (done) {
    fs.unlink(savePath, function (err) {
      assert(!err)
      done()
    })
  })
})
