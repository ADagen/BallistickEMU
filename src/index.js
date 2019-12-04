'use strict'

global.utils = require('./utils/')
global.logger = require('./utils/logger')

const config = require('../config')[parseInt(process.argv[2])]

if (!config) {
  throw new Error('Missing config for specified server id.')
}

global.config = config

const threads = require('os').cpus().length
const { isMaster, fork } = require('cluster')

if (isMaster) {
  for (let i = 0; i < threads; i++) {
    fork().send({ doLog: i === 0 })
  }
} else {
  process.on('message', (message) => {
    if (message.doLog) {
      new (require('./server'))()
    }
  })
}
