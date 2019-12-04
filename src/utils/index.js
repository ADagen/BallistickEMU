'use strict'

/**
 * Generates a random client id
 * @exports
 * @param {Object} clients
 * @returns {Number}
 */
exports.generateClientId = function generateClientId(clients) {
  let localID = 0

  do {
    localID = Math.floor(Math.random() * (900) + 100) // 100-999
  } while (!!clients[localID]) // Must not exist

  return localID
}
