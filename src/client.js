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
     * The item manager class
     * @type {ItemManager}
     */
    this.itemManager = server.itemManager
    /**
     * The client id
     * @type {Number}
     */
    this.clientId = utils.createClientId(server.clients)
    /**
     * The client's ip address
     * @type {String}
     */
    this.ip = socket.remoteAddress.split(':').pop()
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
   * Return the client's inventory string
   * @returns {String}
   */
  get inventoryString() {
    let inventoryStr = ''

    for (const uniqueItemId in this.spinners) {
      const spinner = this.spinners[uniqueItemId]

      inventoryStr += `${spinner.itemId}${Number(spinner.selected)}`
      inventoryStr += `${spinner.innerColor}${spinner.outerColor}`
      inventoryStr += uniqueItemId + ';'
    }

    for (const uniqueItemId in this.pets) {
      const pet = this.pets[uniqueItemId]

      inventoryStr += `${pet.itemId}${Number(pet.selected)}`
      inventoryStr += `${pet.innerColor}${pet.outerColor}`
      inventoryStr += uniqueItemId + ';'
    }

    // Removes the last ';'
    return inventoryStr.slice(0, -1)
  }

  /**
   * Set the client
   * @param {Object} result
   */
  async setClient(result) {
    // Create a client reference to preserve memory
    this.server.lobbyClients[this.clientId] = this.server.clients[this.clientId]
    this.inServer = false
    this.inLobby = true

    // We don't need these
    delete result.password
    delete result.banned

    // Copy object to constructor
    for (const key in result) {
      this[key] = result[key]
    }

    // Override types
    this.user_level = Boolean(this.user_level)
    this.muted = Boolean(this.muted)

    // Const to avoid incorrect dates
    const dateInteger = utils.dateToInt()

    await this.updateTicket(dateInteger)
    await this.updateLastLogin(dateInteger)
    await this.fetchInventory()
  }

  /**
   * Update the client's ticket status
   * @param {Number} dateInteger
   */
  async updateTicket(dateInteger) {
    // Ticket when applicable or when client is new
    if (dateInteger >= this.ticket_date || this.ticket_date === this.created) {
      this.ticket = true
      this.ticket_date += 1

      await this.updateColumn(this.id, 'ticket_date', this.ticket_date)
    } else {
      this.ticket = false
    }
  }

  /**
   * Update the client's last login
   * @param {Number} dateInteger
   */
  async updateLastLogin(dateInteger) {
    if (this.last_login !== dateInteger) { // Only update when needed
      this.last_login = dateInteger
      await this.updateColumn(this.id, 'last_login', dateInteger)
    }
  }

  /**
   * Fetch the client's inventory
   */
  async fetchInventory() {
    const spinners = await this.database.knex('inventory').select('*').where({ id: this.id, itemType: 1 })
    const pets = await this.database.knex('inventory').select('*').where({ id: this.id, itemType: 2 })

    this.spinners = spinners.reduce((o, i) => (o[i.uniqueItemId] = {
      uniqueItemId: i.uniqueItemId,
      itemId: i.itemId,
      selected: Boolean(i.selected),
      innerColor: i.innerColor,
      outerColor: i.outerColor
    }, o), {})
    this.pets = pets.reduce((o, i) => (o[i.uniqueItemId] = {
      uniqueItemId: i.uniqueItemId,
      itemId: i.itemId,
      selected: Boolean(i.selected),
      innerColor: i.innerColor,
      outerColor: i.outerColor
    }, o), {})

    this.fetchSelectedSpinner()
    this.fetchSelectedPet()
  }

  /**
   * Fetch the client's selected spinner
   */
  fetchSelectedSpinner() {
    for (const uniqueItemId in this.spinners) {
      const { selected, itemId, innerColor, outerColor } = this.spinners[uniqueItemId]

      if (selected) {
        this.selectedSpinner = { uniqueItemId, itemId, innerColor, outerColor }
        break // Stop searching
      }
    }
  }

  /**
   * Fetch the client's selected pet
   */
  fetchSelectedPet() {
    this.selectedPet = {} // Client can have no pet selected

    for (const uniqueItemId in this.pets) {
      const { selected, itemId, innerColor, outerColor } = this.pets[uniqueItemId]

      if (selected) {
        this.selectedPet = { uniqueItemId, itemId, innerColor, outerColor }
        break // Stop searching
      }
    }
  }

  /**
   * Add credits to the client
   * @param {Number} amount
   */
  async addCredits(amount) {
    this.credits = Math.max(0, Math.min(this.credits + amount, 999999))
    await this.updateColumn(this.id, 'credits', this.credits)
  }

  /**
   * Remove credits from the client
   * @param {Number} amount
   */
  async removeCredits(amount) {
    this.credits = Math.min(999999, Math.max(this.credits - amount, 0))
    await this.updateColumn(this.id, 'credits', this.credits)
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
   * Send a message to the client
   * @param {String} message
   */
  async sendServerMessage(message) {
    // 0h is the 'Find player' packet, but this works fine
    await this.send(`0h[SERVER] > ${message}`)
  }

  /**
   * Disconnect the client
   */
  async disconnect() {
    this.server.removeClient(this)
  }
}
