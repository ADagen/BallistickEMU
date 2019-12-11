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
    this.server.lobbyClients[this.clientId] = this
    this.inServer = false
    this.inLobby = true

    delete result.password
    delete result.banned

    for (const key in result) {
      this[key] = result[key]
    }

    this.user_level = Boolean(this.user_level)
    this.muted = Boolean(this.muted)
    this.lab_pass = Boolean(this.lab_pass)
    this.ticket = Boolean(this.ticket)

    // Todo: Ticket system

    await this.updateLastLogin(utils.dateToInt())
    await this.fetchInventory()
  }

  /**
   * Update the last login
   * @param {Number} dateInteger
   */
  async updateLastLogin(dateInteger) {
    if (this.last_login !== dateInteger) { // Only update when needed
      await this.updateColumn(this.id, 'last_login', dateInteger)
      this.last_login = dateInteger
    }
  }

  /**
   * Fetch the client's inventory
   */
  async fetchInventory() {
    this.spinners = await this.database.knex('inventory').select('*').where({ id: this.id, itemType: 1 })
    this.pets = await this.database.knex('inventory').select('*').where({ id: this.id, itemType: 2 })

    this.spinners = this.spinners.reduce((o, i) => (o[i.uniqueItemId] = {
      itemId: i.itemId,
      selected: Boolean(i.selected),
      redInner: i.redInner.toString().padStart(3, '0'),
      greenInner: i.greenInner.toString().padStart(3, '0'),
      blueInner: i.blueInner.toString().padStart(3, '0'),
      redOuter: i.redOuter.toString().padStart(3, '0'),
      greenOuter: i.greenOuter.toString().padStart(3, '0'),
      blueOuter: i.blueOuter.toString().padStart(3, '0')
    }, o), {})
    this.pets = this.pets.reduce((o, i) => (o[i.uniqueItemId] = {
      itemId: i.itemId,
      selected: Boolean(i.selected),
      redInner: i.redInner.toString().padStart(3, '0'),
      greenInner: i.greenInner.toString().padStart(3, '0'),
      blueInner: i.blueInner.toString().padStart(3, '0'),
      redOuter: i.redOuter.toString().padStart(3, '0'),
      greenOuter: i.greenOuter.toString().padStart(3, '0'),
      blueOuter: i.blueOuter.toString().padStart(3, '0')
    }, o), {})

    this.fetchSelectedSpinner()
    this.fetchSelectedPet()
  }

  /**
   * Fetch the client's selected spinner
   */
  fetchSelectedSpinner() {
    const spinnerKeys = Object.keys(this.spinners)

    if (spinnerKeys.length === 1) { // Only default spinner
      const uniqueItemId = spinnerKeys[0]

      this.selectedSpinner = JSON.parse(JSON.stringify(this.spinners[uniqueItemId]))
    } else {
      for (const uniqueItemId in this.spinners) {
        const spinner = this.spinners[uniqueItemId]

        if (spinner.selected) {
          this.selectedSpinner = JSON.parse(JSON.stringify(spinner))
          break // Stop searching
        }
      }
    }

    // Clean the selected spinner
    delete this.selectedSpinner.selected
    const { redInner, greenInner, blueInner, redOuter, greenOuter, blueOuter } = this.selectedSpinner
    this.selectedSpinner.innerColor = redInner + greenInner + blueInner
    this.selectedSpinner.outerColor = redOuter + greenOuter + blueOuter
  }

  /**
   * Fetch the client's selected pet
   */
  fetchSelectedPet() {
    if (Object.keys(this.pets).length === 1) { // Only empty pet slot
      this.selectedPet = {}
    } else {
      for (const uniqueItemId in this.pets) {
        const pet = this.pets[uniqueItemId]

        if (pet.selected) {
          this.selectedPet = JSON.parse(JSON.stringify(pet))
          break // Stop searching
        }
      }
    }

    // Clean the selected pet
    delete this.selectedPet.selected
    const { redInner, greenInner, blueInner, redOuter, greenOuter, blueOuter } = this.selectedPet
    this.selectedPet.innerColor = redInner + greenInner + blueInner
    this.selectedPet.outerColor = redOuter + greenOuter + blueOuter
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
