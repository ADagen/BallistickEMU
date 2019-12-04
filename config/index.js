'use strict'

/**
 * @exports
 */
module.exports = {
  100: {
    host: '127.0.0.1',
    port: 1138,
    max: 200,
    timeout: utils.minutesToMilliseconds(1.1)
  },

  101: {
    host: '127.0.0.1',
    port: 1139,
    max: 100,
    timeout: utils.minutesToMilliseconds(1.1)
  }
}
