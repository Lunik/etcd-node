'use strict'

const request = require('request')

class Client {
	constructor(config = {}){
		this.host = config.host || '127.0.0.1'
		this.port = config.port || 2379
	}

	set(key, value, cb){
		request.post({
			url: 'http://' + this.host + ':' +this.port + '/set',
			form: {
				key: key,
				value: value
			}
		}, (err, res, body) =>{
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

	get(key, cb){
		request.post({
			url: 'http://' + this.host + ':' +this.port + '/get',
			form: {
				key: key
			}
		}, (err, res, body) =>{
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

	delete(key, cb){
		request.post({
			url: 'http://' + this.host + ':' +this.port + '/delete',
			form: {
				key: key
			}
		}, (err, res, body) =>{
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
}

module.exports = Client