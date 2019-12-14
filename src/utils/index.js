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

  const prizeArr = prizes[exports.generateRandomNumber(0, 2)] // Random array of prizes

  // Pick a random prize from that array of prizes
  return prizeArr[exports.generateRandomNumber(0, exports.generateRandomNumber(0, prizeArr.length - 1))]
}

/**
 * Get the cost of the item by item id
 * @exports
 * @param {Number} itemId
 * @returns {Number}
 */
exports.getItemCost = function getItemCost(itemId) {
  const costObj = {
    100: 120,
    101: 130,
    102: 370,
    103: 990,
    104: 350,
    105: 420,
    106: 500,
    107: 540,
    108: 660,
    109: 710,
    110: 775,
    111: 850,
    112: 980,
    113: 1500,
    114: 3300,
    115: 4100,
    116: 6500,
    117: 9001,
    118: 2500,
    119: 5200,
    120: 2700,
    121: 1337,
    122: 5350,
    123: 6800,
    124: 1700,
    125: 910,
    126: 2350,
    127: 1259,
    128: 15000,
    129: 1850,
    130: 2925,
    131: 3900,
    132: 625,
    133: 3450,
    134: 4600,
    135: 12000,
    136: 4000,
    137: 2600,
    138: 4800,
    139: 3200,
    140: 6000,
    201: 480,
    202: 650,
    203: 1450,
    204: 2500,
    205: 4500,
    206: 6000
  }

  return costObj[itemId]
}
