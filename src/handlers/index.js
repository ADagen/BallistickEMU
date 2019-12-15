'use strict'

const { verify, argon2id } = require('argon2')

/**
 * @exports
 */
module.exports = {
  /**
   * Handle the server capacity check
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
   * Handle the 1-minute client keep alive check
   * @param {Client} client
   * @param {Boolean} log
   */
  handleKeepAlive: async (client, log) => await client.send('0', log),
  /**
   * Handle the authentication
   * @param {String} data
   * @param {Client} client
   * @param {Boolean} log
   */
  handleAuthentication: async (data, client, log) => {
    // Username and password are split between ;
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
      // Todo: Support time-based (temp) bans
      return await client.send('091', log)
    }

    try {
      const correctPassword = await verify(result.password, password, { type: argon2id })
      if (!correctPassword) throw 'Invalid username or password.' // Caught

      await client.setClient(result) // Sets up the client, important

      let packet = `A${client.clientId}${client.username.padStart(20, '#')}`
      packet += `${client.selectedSpinner.innerColor}${client.selectedSpinner.outerColor}`
      packet += `${client.kills};${client.deaths};${client.wins};${client.losses};${client.rounds};`
      packet += `1;9999;${Number(client.ticket)};${client.credits};${Number(client.user_level)}`

      await client.send(packet, log)
      await client.sendServerMessage(`Welcome to BallistickEMU, ${username}`)
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
    // Cheating for rewards
    if (!client.ticket) {
      return await client.disconnect()
    }

    // Set date upon claim
    client.ticket_date += 1
    await client.updateColumn(client.id, 'ticket_date', client.ticket_date)

    const [prizeId, prizeAmount] = utils.generateLuckyPrize()

    await client.addCredits(prizeAmount)
    await client.send(`0a${prizeId}`, log)
  },
  /**
   * Handle the inventory request
   * @param {Client} client
   * @param {Boolean} log
   */
  handleGetInventory: async (client, log) => await client.send(`0c${client.inventoryString}`, log),
  /**
   * Handle the item selection
   * @param {String} uniqueItemId
   * @param {Client} client
   * @param {Boolean} log
   */
  handleSelectItem: async (uniqueItemId, client, log) => {
    // The unique item id must be a number and the client must own it
    if (isNaN(uniqueItemId) || !client.spinners[uniqueItemId] && !client.pets[uniqueItemId]) {
      return await client.disconnect()
    }

    if (client.pets[uniqueItemId]) {
      const selected = client.selectedPet

      if (client.pets[uniqueItemId].itemId === 200) { // Selecting no pets
        await client.database.knex('inventory').update('selected', 0).where('uniqueItemId', selected.uniqueItemId)

        // No need to select any pet
        client.pets[selected.uniqueItemId].selected = 0
        client.selectedPet = {}
      } else {
        const hasPet = Object.keys(selected).length !== 0  // Selecting from no pet to pet

        if (hasPet) {
          await client.database.knex('inventory').update('selected', 0).where('uniqueItemId', selected.uniqueItemId)
        }

        await client.database.knex('inventory').update('selected', 1).where({ uniqueItemId })

        if (hasPet) {
          client.pets[selected.uniqueItemId].selected = 0
        }

        client.pets[uniqueItemId].selected = 1
        client.selectedPet = client.pets[uniqueItemId]
      }
    } else {
      const selected = client.selectedSpinner

      await client.database.knex('inventory').update('selected', 0).where('uniqueItemId', selected.uniqueItemId)
      await client.database.knex('inventory').update('selected', 1).where({ uniqueItemId })

      client.spinners[selected.uniqueItemId].selected = 0
      client.spinners[uniqueItemId].selected = 1
      client.selectedSpinner = client.spinners[uniqueItemId]
    }
  },
  /**
   * Handle item purchases
   * @param {String} data
   * @param {Client} client
   * @param {Boolean} log
   */
  handleBuyItem: async (data, client, log) => {
    if (data.length < 21 || isNaN(data)) {
      return await client.disconnect()
    }

    // Todo: Map slots

    const itemId = parseInt(data.substring(0, 3))
    const cost = client.itemManager.getItemCost(itemId)

    // Item doesn't exist or client is cheating to buy it
    if (!cost || client.credits < cost) {
      return await client.disconnect()
    }

    const innerColor = data.substring(3, 12)
    const outerColor = data.substring(12)
    const itemType = client.itemManager.getItemType(itemId)
    const inventoryObj = client.itemManager.isPet(itemId) ? client.pets : client.spinners

    // Add to database/client and remove credit cost
    const uniqueItemId = await client.database.knex('inventory').insert({ id: client.id, itemType, itemId, selected: 0, innerColor, outerColor })
    inventoryObj[uniqueItemId[0]] = { itemId, selected: 0, innerColor, outerColor, uniqueItemId: uniqueItemId[0] } // Important order
    await client.removeCredits(cost)
  }
}
