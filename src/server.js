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
}
