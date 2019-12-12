'use strict'

const { verify, argon2id } = require('argon2')

/**
 * @exports
 */
module.exports = {
  /**
   * Check the server capacity
   * @param {String} data
   * @param {Client} client
   * @param {Boolean} log
   */
  handleCheckServerCapacity: async (data, client, log) => {
    if (data === 'Hx09TdCC62Nwln1P') {
      client.server.isFull ? await client.send('090', log) : await client.send('08', log)
    } else {
      await client.disconnect()
    }
  },
  /**
   * Keep the client alive
   * @param {Client} client
   * @param {Boolean} log
   */
  handleKeepAlive: async (client, log) => { await client.send('0', log) },
  /**
   * Handle the authentication
   * @param {String} data
   * @param {Client} client
   * @param {Boolean} log
   */
  handleAuthentication: async (data, client, log) => {
    // Username and password are padded between ;
    if (data.indexOf(';') === -1) {
      return await client.disconnect()
    }

    const [username, password] = data.split(';')

    // Username and password must match our strict regex
    if (!username.match(/^[a-zA-Z0-9.,]{3,20}$/) || !password.match(/^[a-zA-Z0-9.,]{3,20}$/)) {
      return await client.disconnect()
    }

    // Client must match some properties
    if (client.inLobby || !client.inServer) {
      return await client.disconnect()
    }

    const result = await client.database.knex('users').first().where({ username })

    // Username does not exist
    if (!result) {
      return await client.send('09', log)
    }

    if (result.banned) {
      // Todo: Support time-based bans
      return await client.send('091', log)
    }

    try {
      const correctPassword = await verify(result.password, password, { type: argon2id })
      if (!correctPassword) throw 'Invalid username or password.'

      await client.setClient(result)

      let packet = `A${client.clientId}${client.username.padStart(20, '#')}`
      packet += `${client.selectedSpinner.innerColor}${client.selectedSpinner.outerColor}`
      packet += `${client.kills};${client.deaths};${client.wins};${client.losses};${client.rounds};`
      packet += `${Number(client.lab_pass)};${client.lab_pass_days};${Number(client.ticket)};${client.credits};${Number(client.user_level)}`

      await client.send(packet, log)
    } catch (e) {
      await client.send('09', log)
    }
  },
  /**
   * Handle the ticket request
   * @param {Client} client
   * @param {Boolean} log
   */
  handleTicket: async (client, log) => {
    // Todo
  }
}
