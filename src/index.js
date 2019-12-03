'use strict'

const serverId = parseInt(process.argv[2])

if (!serverId) {
  throw new Error('You must specify a valid server id.')
}
