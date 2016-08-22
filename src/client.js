'use strict'

var request = require('request')

function Client (config) {
  config = config || {}
  this.host = config.host || '127.0.0.1'
  this.port = config.port || 2379
}

Client.prototype.set = function (key, value, cb) {
  request.post({
    url: 'http://' + this.host + ':' + this.port + '/set',
    form: {
      key: key,
      value: value
    }
  }, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      cb(JSON.parse(body))
    } else {
      cb({
        code: res.statusCode,
        message: err
      })
    }
  })
}

Client.prototype.get = function (key, cb) {
  request.post({
    url: 'http://' + this.host + ':' + this.port + '/get',
    form: {
      key: key
    }
  }, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      cb(JSON.parse(body))
    } else {
      cb({
        code: res.statusCode,
        message: err
      })
    }
  })
}

Client.prototype.delete = function (key, cb) {
  request.post({
    url: 'http://' + this.host + ':' + this.port + '/delete',
    form: {
      key: key
    }
  }, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      cb(JSON.parse(body))
    } else {
      cb({
        code: res.statusCode,
        message: err
      })
    }
  })
}

Client.prototype.add = function (key, value, cb) {
  request.post({
    url: 'http://' + this.host + ':' + this.port + '/add',
    form: {
      key: key,
      value: value
    }
  }, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      cb(JSON.parse(body))
    } else {
      cb({
        code: res.statusCode,
        message: err
      })
    }
  })
}

module.exports = Client
