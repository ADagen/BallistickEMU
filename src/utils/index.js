'use strict'

/**
 * Generates a random client id
 * @exports
 * @param {Object} clients
 * @returns {Number}
 */
exports.generateClientId = function generateClientId(clients) {
  let localID = 0

  do { localID = Math.floor(Math.random() * (900) + 100) } while (!!clients[localID])

  return localID
}
