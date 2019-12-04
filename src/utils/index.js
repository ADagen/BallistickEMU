'use strict'

/**
 * Create a client id by incrementing the last client id
 * @exports
 * @param {Object} clients
 * @returns {Number}
 */
exports.createClientId = function createClientId(clients) {
  const clientIds = Object.keys(clients)

  // No client ids? Begin with 100, else +1 the last client id
  return clientIds.length === 0 ? 100 : parseInt(clientIds.pop()) + 1
}

/**
 * Validates the max property in the config
 * @exports
 * @param {Number} max
 * @returns {Number}
 */
exports.validateMaxProp = function validateMaxProp(max) {
  if (isNaN(max)) {
    throw new Error(`Invalid config value for 'max'.`)
  }

  max = parseInt(max)

  if (max > 899) {
    throw new Error('You can only have a maximum of 899 clients on each server.')
  }

  return max
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
