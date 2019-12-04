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
