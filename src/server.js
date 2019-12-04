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
     * Start the server
     */
    this.start()
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

      // Disconnect the client when the server is full
      if (this.isFull) {
        socket.write('090\0')
        socket.end()
        socket.destroy()
        return
      }

      // Create a new client
      const client = new Client(socket, this)
      this.clients[client.clientId] = client
      logger.info(`${client.clientId} has connected.`)

      socket.on('data', (data) => console.log(data.split('\0')[0]))
      socket.on('close', () => client.disconnect())
      socket.on('error', () => client.disconnect())
      socket.on('timeout', () => client.disconnect())
    }).listen(config.port, config.host, () => logger.info(`BallistickEMU listening on ${config.host}:${config.port}.`))
  }

  /**
   * Stop the server
   */
  stop() {
    logger.info(`Stopping, disconnecting ${this.clientCount} clients.`)

    for (const clientId in this.clients) {
      this.removeClient(this.clients[clientId])
    }

    process.exit(0)
  }

  /**
   * Remove a client
   * @param {Client} client
   */
  removeClient(client) {
    if (this.clients[client.clientId]) {
      delete this.clients[client.clientId]

      client.socket.end()
      client.socket.destroy()

      logger.info(`${client.clientId} has disconnected.`)
    }
  }
}
