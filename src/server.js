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
}
