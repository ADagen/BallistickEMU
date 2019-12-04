'use strict'

global.utils = require('./utils/')
global.logger = require('./utils/logger')

const serverId = parseInt(process.argv[2])

if (!serverId) {
  throw new Error('You must specify a valid server id.')
}

const config = require('../config')[serverId]

if (!config) {
  throw new Error('Missing config for specified server id.')
}

if (config.max > 899) {
  throw new Error('You can only have a maximum of 899 clients on each server.')
}

// Globals that are used in the emulator
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
