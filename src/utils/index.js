'use strict'

/**
 * Create a client id by incrementing the last client id
 * @exports
 * @param {Object} clients
 * @returns {Number}
 */
exports.createClientId = function createClientId(clients) {
  return Math.max(100, Object.keys(clients).length + 100)
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

/**
 * Converts a date to an integer
 * @exports
 * @param {Date} date
 * @returns {Number}
 */
exports.dateToInt = function dateToInt(date = new Date()) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
}

/**
 * Generate a random number between 2 numbers
 * @exports
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
exports.generateRandomNumber = function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Generate a random lucky prize
 * @exports
 * @returns {Array}
 */
exports.generateLuckyPrize = function generateLuckyPrize() {
  const prizes = [
    // Small prizes
    [[0, 20], [1, 25], [2, 30], [3, 35], [4, 40], [5, 55], [6, 60], [7, 75]],
    // Medium prizes
    [[8, 100], [9, 250], [10, 500], [11, 999]],
    // Big prizes
    [[12, 1500], [13, 5000]]
  ]

  const prizeArr = prizes[exports.generateRandomNumber(0, 2)]

  return prizeArr[exports.generateRandomNumber(0, exports.generateRandomNumber(0, prizeArr.length - 1))]
}
