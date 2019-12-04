'use strict'

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
  }

  /**
   * Return the amount of clients connected
   * @returns {Number}
   */
  get clientCount() {
    return Object.keys(this.clients).length
  }
}
