'use strict'

var path = require('path')
var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')
var compression = require('compression')

function Server (config) {
  var self = this
  config = config || {}
  self.host = config.host || '127.0.0.1'
  self.port = config.port || 2379
  self.savePath = config.savePath

  if (self.savePath) {
    fs.stat(self.savePath, function (err, stats) {
      if (err && typeof stats === 'undefined') {
        fs.writeFile(self.savePath, JSON.stringify({}), function (err) {
          if (err) {
            throw err
          }
          self.data = require(self.savePath)
        })
      } else {
        self.data = require(self.savePath)
      }
    })
  } else {
    self.data = {}
  }

  self.app = express()
  self.app.use(compression())
  self.app.use(bodyParser.json())
  self.app.use(bodyParser.urlencoded({
    extended: true
  }))

  self.app.put('/set', function (req, res) {
    if (req.body.key && req.body.value) {
      var key = req.body.key
      var value = req.body.value
      self.data[key] = value
      res.end(JSON.stringify({
        code: 200,
        message: 'OK',
        data: {
          key: key,
          value: value
        }
      }))
    } else {
      res.end(JSON.stringify({
        code: 400,
        message: 'Missing key or value.'
      }))
    }
  })

  self.app.get('/get', function (req, res) {
    if (req.body.key) {
      var key = req.body.key
      if (self.data[key]) {
        var storage = self.data[key]
        res.end(JSON.stringify({
          code: 200,
          message: 'OK',
          data: {
            key: key,
            value: storage
          }
        }))
      } else {
        res.end(JSON.stringify({
          code: 204,
          message: 'No content for this key.',
          key: key
        }))
      }
    } else {
      res.end(JSON.stringify({
        code: 400,
        message: 'Missing key.'
      }))
    }
  })

  self.app.get('/find', function (req, res) {
    if(req.body.regex){
      var regex = req.body.regex
      var keys = Object.keys(self.data)
      if(keys.length > 0){
        var list = {}

        keys.forEach(function(key, index){
          list[key] = self.data[key]

          if(index >= keys.length-1){
            res.end(JSON.stringify({
              code: 200,
              message: 'OK',
              data: {
                regex: regex,
                value: list
              }
            }))
          }
        })
      } else {
        res.end(JSON.stringify({
          code: 204,
          message: 'No content for this regex.',
          regex: regex
        }))
      }
    } else {
      res.end(JSON.stringify({
        code: 400,
        message: 'Missing regex.'
      }))
    }
  })

  self.app.delete('/delete', function (req, res) {
    if (req.body.key) {
      var key = req.body.key
      if (self.data[key]) {
        var storage = self.data[key]
        delete self.data[key]
        res.end(JSON.stringify({
          code: 200,
          message: 'OK',
          data: {
            key: key,
            value: storage
          }
        }))
      } else {
        res.end(JSON.stringify({
          code: 204,
          message: 'No content for this key.',
          key: key
        }))
      }
    } else {
      res.end(JSON.stringify({
        code: 400,
        message: 'Missing key.'
      }))
    }
  })
}

Server.prototype.start = function (cb) {
  cb = cb || function () {}
  this.app.listen(this.port, this.host, cb(this.host, this.port))
}

Server.prototype.save = function (cb) {
  cb = cb || function () {}
  fs.writeFile(path.join(this.savePath), JSON.stringify(this.data), cb)
}

module.exports = Server
