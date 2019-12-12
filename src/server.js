'use strict'

const Client = require('./client')

/**
 * @exports
 * @class
 */
module.exports = class Server {
  /**
   * @constructor
   */
  constructor() {
    /**
     * The connected clients
     * @type {Object}
     */
    this.clients = {}
    /**
     * The lobby clients
     * @type {Object}
     */
    this.lobbyClients = {}

    /**
     * The network class
     * @type {Network}
     */
    this.network = require('./system/network')
    /**
     * The database class
     * @type {Database}
     */
    this.database = new (require('./system/database'))(require('../config/database'))

    /**
     * Start the server
     */
    this.network.validateHandlers().then(() => { this.start() }).catch((err) => logger.error(err))
    /**
     * Stop the server
     */
    process.on('SIGTERM', () => this.stop())
    process.on('SIGINT', () => this.stop())
  }

  /**
   * Return the amount of clients connected
   * @returns {Number}
   */
  get clientCount() {
    return Object.keys(this.clients).length
  }

  /**
   * Return whether the server is full or not
   * @returns {Boolean}
   */
  get isFull() {
    return this.clientCount >= config.max
  }

  /**
   * Return a client by client id
   * @param {Number} clientId
   * @returns {Client}
   */
  getClient(clientId) {
    return this.clients[clientId]
  }

  /**
   * Start the server
   */
  start() {
    require('net').createServer((socket) => {
      socket.setEncoding('utf8')
      socket.setTimeout(config.timeout)

      // Create a new client
      const client = new Client(socket, this)
      this.clients[client.clientId] = client
      logger.info(`${client.clientId} has been connected.`)

      // Our server events
      socket.on('data', async (data) => await this.network.handlePacket(data.split('\0')[0], client))
      socket.on('close', async () => await client.disconnect())
      socket.on('error', async () => await client.disconnect())
      socket.on('timeout', async () => await client.disconnect())
    }).listen(config.port, config.host, () => logger.info(`BallistickEMU listening on ${config.host}:${config.port}.`))
  }

  /**
   * Stop the server
   */
  stop() {
    if (this.clientCount > 0) {
      logger.info(`Stopping the server, disconnecting ${this.clientCount} clients.`)

      // Raw disconnect
      for (const clientId in this.clients) {
        this.removeClient(this.clients[clientId])
      }
    }

    process.exit(0) // Exits npm
  }

  /**
   * Remove a client
   * @param {Client} client
   */
  removeClient(client) {
    if (client.inServer) {
      delete this.clients[client.clientId]

      client.socket.end()
      client.socket.destroy()
    }

    if (client.inLobby) {
      delete this.lobbyClients[client.clientId]
    }

    logger.info(`${client.clientId} has been disconnected.`)
  }
}
