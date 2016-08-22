'use strict'

const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')

class EtcdServer {
	constructor(config = {}){
		this.host = config.host || '127.0.0.1'
		this.port = config.port || 2379
		this.savePath = config.savePath

		if(this.savePath){
			fs.stat(this.savePath, (err, stats)=>{
				if (err && typeof stats === 'undefined'){
					fs.writeFile(this.savePath, JSON.stringify({}), (err)=>{
						if (err){
							throw err
						}
						this.data = require(this.savePath)
					})
				} else {
					this.data = require(this.savePath)
				}
			})
		} else {
			this.data = {}
		}
		
		this.app = express()
		this.app.use(compression())
  		this.app.use(bodyParser.json())
  		this.app.use(bodyParser.urlencoded({
    		extended: true
  		}))

  		this.app.post('/set', (req, res)=>{
			if(req.body.key && req.body.value){
				let key = req.body.key
				let value = req.body.value
				this.data[key] = value
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
		
		this.app.post('/get', (req, res)=>{
			if(req.body.key){
				let key = req.body.key
				if(this.data[key]){
					let value = this.data[key]
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

		this.app.post('/delete', (req, res)=>{
			if(req.body.key){
				let key = req.body.key
				if(this.data[key]){
					let value = this.data[key]
					delete this.data[key]
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
						code: 204,
						message: 'No content for this key.',
						key: key
					}))
				}
			} else {
				res.end(JSON.stringify({
					code: 400,
					message: 'Missing key or value.'
				}))
			}
		})
	}

	start(cb = ()=>{}) {
		this.app.listen(this.port, this.host, cb(this.host, this.port))
	}

	save(cb = ()=>{}) {
		fs.writeFile(path.join(this.savePath), JSON.stringify(this.data), cb)
	}
}

module.exports = EtcdServer