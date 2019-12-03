'use strict'

/**
 * The colors
 * @constant
 */
const colorize = (...args) => ({
  bgBlack: `\x1b[40m${args.join(' ')}\x1b[0m`,
  red: `\x1b[31m${args.join(' ')}`,
  green: `\x1b[32m${args.join(' ')}`,
  cyan: `\x1b[36m${args.join(' ')}`,
  blue: `\x1b[34m${args.join(' ')}`
})

/**
 * @exports
 * @class
 * @static
 */
module.exports = class Logger {
  /**
   * Logs a message
   * @param {String} type
   * @param {String} message
   * @throws {TypeError}
   * @returns {Console}
   */
  static log(type, message) {
    let toLog = colorize(`[${type}]`).bgBlack + ' > '

    switch (type) {
      case 'INFO': toLog = colorize(toLog).green; break
      case 'ERROR': toLog = colorize(toLog).red; break
      case 'INCOMING': toLog = colorize(toLog).cyan; break
      case 'OUTGOING': toLog = colorize(toLog).blue; break
      default: throw new TypeError(`Unknown log type: ${type}`)
    }

    return console.log(toLog + message)
  }

  /**
   * Logs an info message
   * @param {String} message
   * @returns {Console}
   */
  static info(message) {
    return this.log('INFO', message)
  }

  /**
   * Logs an error message
   * @param {String} message
   * @returns {Console}
   */
  static error(message) {
    return this.log('ERROR', message)
  }

  /**
   * Logs an incoming message
   * @param {String} message
   * @returns {Console}
   */
  static incoming(message) {
    return this.log('INCOMING', message)
  }

  /**
   * Logs an outgoing message
   * @param {String} message
   * @returns {Console}
   */
  static outgoing(message) {
    return this.log('OUTGOING', message)
  }
}
