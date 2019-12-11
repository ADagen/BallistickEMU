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
     * The database class
     * @type {Database}
     */
    this.database = server.database
    /**
     * The client id
     * @type {Number}
     */
    this.clientId = utils.createClientId(server.clients)
    /**
     * Defines whether the client is in the server or not
     * @type {Boolean}
     */
    this.inServer = true
    /**
     * Defines whether the client is in the lobby or not
     * @type {Boolean}
     */
    this.inLobby = false
  }

  /**
   * Set the client
   * @param {Object} result
   */
  async setClient(result) {
    delete result.password
    delete result.banned

    for (const key in result) {
      this[key] = result[key]
    }

    this.user_level = Boolean(this.user_level)
    this.muted = Boolean(this.muted)
    this.lab_pass = Boolean(this.lab_pass)
    this.ticket = Boolean(this.ticket)

    // Todo: Set ticket to true when needed

    await this.updateLastLogin(utils.dateToInt())
    await this.fetchSpinners()
    await this.fetchPets()
  }

  /**
   * Update the last login
   * @param {Number} dateInteger
   */
  async updateLastLogin(dateInteger) {
    if (this.last_login !== dateInteger) {
      await this.updateColumn(this.id, 'last_login', dateInteger)
      this.last_login = dateInteger
    }
  }

  /**
   * Fetch the client's spinners
   */
  async fetchSpinners() {
    this.spinners = await this.database.knex('inventory').select('*').where('id', this.id).andWhere('itemType', 1)
    this.spinners = this.spinners.reduce((o, i) => (o[i.uniqueItemId] = {
      itemId: i.itemId,
      selected: Boolean(i.selected),
      redInner: i.redInner,
      greenInner: i.greenInner,
      blueInner: i.blueInner,
      redOuter: i.redOuter,
      greenOuter: i.greenOuter,
      blueOuter: i.blueOuter
    }, o), {})
  }

  /**
   * Fetch the client's pets
   */
  async fetchPets() {
    this.pets = await this.database.knex('inventory').select('*').where('id', this.id).andWhere('itemType', 2)
    this.pets = this.pets.reduce((o, i) => (o[i.uniqueItemId] = {
      itemId: i.itemId,
      selected: Boolean(i.selected),
      redInner: i.redInner,
      greenInner: i.greenInner,
      blueInner: i.blueInner,
      redOuter: i.redOuter,
      greenOuter: i.greenOuter,
      blueOuter: i.blueOuter
    }, o), {})
  }

  /**
   * Updates a column
   * @param {String|Number} playerIdentify
   * @param {String} column
   * @param {String|Number} value
   */
  async updateColumn(playerIdentify, column, value) {
    try {
      await this.database.knex('users').update(column, value).where(isNaN(playerIdentify) ? 'username' : 'id', playerIdentify)
    } catch (e) {
      await this.disconnect()
    }
  }

  /**
   * Send data to the client
   * @param {String} data
   * @param {Boolean} log
   */
  async send(data, log = true) {
    // The socket must exist
    if (this.socket && this.socket.writable) {
      if (log) logger.outgoing(data)

      this.socket.write(`${data}\0`)
    }
  }

  /**
   * Disconnect the client
   */
  async disconnect() {
    this.server.removeClient(this)
  }
}
