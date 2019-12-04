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
}
