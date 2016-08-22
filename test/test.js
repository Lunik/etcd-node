'use strict'
const assert = require('chai').assert
const path = require('path')
const fs = require('fs')

global.__base = path.join(__dirname, '..', '/')

const savePath = path.join(__dirname, 'etcd.json')
describe('Etcd test', ()=>{
	const Etcd = require(path.join(__base, 'src/server.js'))
	const EtcdWorker = new Etcd({
		savePath: savePath
	})
	const EtcdWorker3 = new Etcd({
		port: 2381
	})

	it('Start / Stop server', (done)=>{
		EtcdWorker.start((host, port)=>{
			assert.equal(host, '127.0.0.1')
			assert.equal(port, 2379)

			const EtcdWorker2 = new Etcd({
				port: 2380,
				savePath: savePath
			})

			EtcdWorker2.start((host, port)=>{
				assert.equal(host, '127.0.0.1')
				assert.equal(port, 2380)
				EtcdWorker3.start((host, port)=>{
					assert.equal(host, '127.0.0.1')
					assert.equal(port, 2381)
					done()
				})
			})
		})
	})
	it('Save', (done)=>{
		EtcdWorker.save((err)=>{
			assert(!err)
			done()
		})
	})
})

describe('Client test', ()=>{
	const Client = require(path.join(__base, 'src/client.js'))
	const ClientWorker = new Client()

	it('Set key=value', (done)=>{
		ClientWorker.set('key', 'value', (data)=>{
			assert.equal(data.code, 200)
			assert.equal(data.data.key, 'key')
			assert.equal(data.data.value, 'value')
			done()
		})
	})

	it('Set null=value', (done)=>{
		ClientWorker.set(null, 'value', (data)=>{
			assert.equal(data.code, 400)
			done()
		})
	})

	it('Get key', (done)=>{
		ClientWorker.get('key', (data)=>{
			assert.equal(data.code, 200)
			assert.equal(data.data.key, 'key')
			assert.equal(data.data.value, 'value')
			done()
		})
	})

	it('Get unknown', (done)=>{
		ClientWorker.get('unknown', (data)=>{
			assert.equal(data.code, 204)
			done()
		})
	})

	it('Get null', (done)=>{
		ClientWorker.get(null, (data)=>{
			assert.equal(data.code, 400)
			done()
		})
	})

	it('Delete key', (done)=>{
		ClientWorker.delete('key', (data)=>{
			assert.equal(data.code, 200)
			assert.equal(data.data.key, 'key')
			assert.equal(data.data.value, 'value')
			done()
		})
	})

	it('Delete unknown', (done)=>{
		ClientWorker.delete('unknown', (data)=>{
			assert.equal(data.code, 204)
			done()
		})
	})

	it('Delete null', (done)=>{
		ClientWorker.delete(null, (data)=>{
			assert.equal(data.code, 400)
			done()
		})
	})

	it('Add key2=value and key2=value2', (done)=>{
		ClientWorker.add('key2', 'value', (data)=>{
			assert.equal(data.code, 200)
			assert.equal(data.data.key, 'key2')
			assert.equal(data.data.value, 'value')
			ClientWorker.add('key2', 'value2', (data)=>{
				assert.equal(data.code, 200)
				assert.equal(data.data.key, 'key2')
				assert.equal(data.data.value[0], 'value')
				assert.equal(data.data.value[1], 'value2')
				done()
			})
		})
	})

	it('Add null=value', (done)=>{
		ClientWorker.add(null, 'value', (data)=>{
			assert.equal(data.code, 400)
			done()
		})
	})

	it('Set key3=value and add key3=value3', (done)=>{
		ClientWorker.set('key3', 'value', (data)=>{
			assert.equal(data.code, 200)
			assert.equal(data.data.key, 'key3')
			assert.equal(data.data.value, 'value')
			ClientWorker.add('key3', 'value2', (data)=>{
				assert.equal(data.code, 200)
				assert.equal(data.data.key, 'key3')
				assert.equal(data.data.value[0], 'value')
				assert.equal(data.data.value[1], 'value2')
				done()
			})
		})
	})
})

describe('Cleanup', ()=>{
	it('Remove etcd.json', (done)=>{
		fs.unlink(savePath, (err)=>{
			assert(!err)
			done()
		})
	})
})
