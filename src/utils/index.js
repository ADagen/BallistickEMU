'use strict'

/**
 * Creates a client id by incrementing the last client id by 1
 * @exports
 * @param {Object} clients
 * @returns {Number}
 */
exports.createClientId = function createClientId(clients) {
  return parseInt(Object.keys(clients).pop()) + 1
}

/**
 * Converts an amount of minutes to milliseconds
 * @exports
 * @param {Number} minutes
 * @returns {Number}
 */
exports.minutesToMilliseconds = function minutesToMilliseconds(minutes) {
  return minutes * 60000
}
