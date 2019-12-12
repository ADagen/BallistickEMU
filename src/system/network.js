'use strict'

/**
 * The handlers
 * @constant
 */
const Handlers = require('../handlers/')

/**
 * The packet identifiers
 * @constant
 */
const packets = {
  '08': { func: 'handleCheckServerCapacity', enabled: true, log: false },
  '0': { func: 'handleKeepAlive', enabled: true, log: false },
  '09': { func: 'handleAuthentication', enabled: true, log: true },
  '0a': { func: 'handleTicket', enabled: true, log: true },
  '0c': { func: 'handleGetInventory', enabled: true, log: true },
  '0d': { func: 'handleSelectItem', enabled: true, log: true }
}

/**
 * @exports
 * @class
 */
module.exports = class Network {
  /**
   * Validate the handlers
   * @returns {Promise}
   */
  static validateHandlers() {
    return new Promise((resolve) => {
      for (const identifier in packets) {
        const packet = packets[identifier]

        if (packet.enabled && !Handlers[packet.func]) {
          throw `Missing packet: '${packet.func}' with identifier: '${identifier}'.`
        }
      }

      resolve()
    })
  }

  /**
   * Handle an incoming packet
   * @param {String} data
   * @param {Client} client
   */
  static async handlePacket(data, client) {
    if (data === '<policy-file-request/>') {
      return await client.send(`<cross-domain-policy><allow-access-from domain='*' to-ports='*' /></cross-domain-policy>`, false)
    }

    const beginChr = data.charAt()
    const identifier = beginChr === '0' ? data.substring(0, 2) : beginChr
    const args = data.slice(identifier.length)
    const packet = packets[identifier]

    if (!packet) {
      logger.error(`Unknown packet: '${data}'`)
    } else if (packet.enabled) {
      if (packet.log) logger.incoming(data)

      args ? await Handlers[packet.func](args, client, packet.log) : await Handlers[packet.func](client, packet.log)
    }
  }
}
