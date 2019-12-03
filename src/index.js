'use strict'

const serverId = parseInt(process.argv[2])

if (!serverId) {
  throw new Error('You must specify a valid server id.')
}

const config = require('../config')[serverId]

if (!config) {
  throw new Error('Missing config for specified server id.')
}

global.config = config
global.logger = require('./utils/logger')
