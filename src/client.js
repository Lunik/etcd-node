'use strict'

var request = require('request')

function Client (config) {
  config = config || {}
  this.host = config.host || '127.0.0.1'
  this.port = config.port || 2379
}

Client.prototype.set = function (key, value, cb) {
  request.put({
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
  request.get({
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

Client.prototype.find = function (regex, cb) {
  request.get({
    url: 'http://' + this.host + ':' + this.port + '/find',
    form: {
      regex: regex
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
  request.delete({
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

module.exports = Client
