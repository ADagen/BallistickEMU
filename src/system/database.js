'use strict'

/**
 * @exports
 * @class
 */
module.exports = class Database {
  /**
   * @constructor
   * @param {Object} config
   */
  constructor(config) {
    /**
     * The database driver
     * @type {Database.knex}
     */
    this.knex = require('knex')({
      client: 'mysql2',
      connection: config,
      pool: { min: 0, max: 10 }
    })
  }
}
