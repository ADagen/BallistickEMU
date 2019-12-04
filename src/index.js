'use strict'

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
global.logger = require('./utils/logger')
global.utils = require('./utils/')
