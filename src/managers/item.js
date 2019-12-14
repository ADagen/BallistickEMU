'use strict'

/**
 * @exports
 * @class
 */
module.exports = class ItemManager {
  /**
   * The spinners
   * @type {Object}
   */
  static spinners = {}
  /**
   * The pets
   * @type {Object}
   */
  static pets = {}

  /**
   * Load the items
   * @returns {Promise}
   */
  static loadItems() {
    return new Promise((resolve) => {
      try {
        this.spinners = require('../crumbs/spinners')
        this.pets = require('../crumbs/pets')
      } catch (e) {
        throw 'Could not load items.'
      }

      logger.info(`Loaded ${Object.keys(this.spinners).length} spinners.`)
      logger.info(`Loaded ${Object.keys(this.pets).length} pets.`)

      resolve()
    })
  }

  /**
   * Return the crumb
   * @param {Number} itemId
   * @returns {String}
   */
  static getCrumb(itemId) {
    return this.isPet(itemId) ? 'pets' : 'spinners'
  }

  /**
   * Return whether the item is a pet or not
   * @param {Number} itemId
   * @returns {Boolean}
   */
  static isPet(itemId) {
    return !!this.pets[itemId]
  }

  /**
   * Return whether the item is a pet or not
   * @param {Number} itemId
   * @returns {Boolean}
   */
  static isSpinner(itemId) {
    return !!this.spinners[itemId]
  }

  /**
   * Return the item type
   * @param {Number} itemId
   * @returns {Number}
   */
  static getItemType(itemId) {
    return this.isPet(itemId) ? 2 : 1
  }

  /**
   * Returns whether the item exists or not
   * @param {Number} itemId
   * @returns {Boolean}
   */
  static itemExists(itemId) {
    return !!this.getItemCost(itemId)
  }

  /**
   * Return the item cost
   * @param {Number} itemId
   * @returns {Number}
   */
  static getItemCost(itemId) {
    return this[this.getCrumb(itemId)][itemId]
  }
}
