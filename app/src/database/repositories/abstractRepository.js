export class AbstractRepository {

  /**
   * The AbstractRepository class constructor.
   *
   * @param {Object} options
   * @param {Object} options.validator A validator implementation
   * @param {Object} options.db The database connection
   */
  constructor(options) {
    if (this.constructor === AbstractRepository) {
      throw new TypeError('Cannot construct abstract class.');
    }

    const {validator, db} = options;

    if (validator === undefined || validator === null) {
      throw new Error('Validator is required.');
    }

    if (db === undefined || db === null) {
      throw new Error('The database connection is required.');
    }

    this._validator = validator;
    this._db        = db;
  }

  /**
   * Trims and escapes strings provided in arguments
   * @param {Object} data The data to sanitize
   * @returns {Object}
   */
  _sanitize(data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = this._validator.trim(data[key]);
        data[key] = this._validator.escape(data[key]);
      }
    }

    return data;
  }
}
