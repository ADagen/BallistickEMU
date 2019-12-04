'use strict'

/**
 * Generates a random local ID
 * @exports
 * @param {Object} clients
 * @returns {Number}
 */
exports.generateLocalID = function generateLocalID(clients) {
  let localID = 0

  do {
    localID = Math.floor(Math.random() * (999 - 100 + 1) + 100)
  } while (!!clients[localID])

  return localID
}
