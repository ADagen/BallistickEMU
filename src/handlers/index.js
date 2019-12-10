'use strict'

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
  }
}
