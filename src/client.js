'use strict'

/**
 * @exports
 * @class
 */
module.exports = class Client {
  /**
   * @constructor
   * @param {Socket} socket
   * @param {Server} server
   */
  constructor(socket, server) {
    /**
     * The socket
     * @type {Socket}
     */
    this.socket = socket
    /**
     * The server
     * @type {Server}
     */
    this.server = server
    /**
     * The client id
     * @type {Number}
     */
    this.clientId = utils.createClientId(server.clients)
    /**
     * Defines if the client is in the server or not
     * @type {Boolean}
     */
    this.inServer = true
    /**
     * Defines if the client is in the lobby or not
     * @type {Boolean}
     */
    this.inLobby = false
  }

  /**
   * Send data to the client
   * @param {String} data
   * @param {Boolean} log
   */
  send(data, log = true) {
    // The socket must exist
    if (this.socket && this.socket.writable) {
      if (log) logger.outgoing(data)

      this.socket.write(`${data}\0`)
    }
  }

  /**
   * Disconnect the client
   */
  disconnect() {
    this.server.removeClient(this)
  }
}
