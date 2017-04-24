export class AbstractRepository {

  /**
   * The AbstractRepository class constructor.
   *
   * @param {Object} options
   * @param {Object} options.db The database connection
   */
  constructor(options) {
    if (this.constructor === AbstractRepository) {
      throw new TypeError('Cannot construct abstract class.');
    }

    const {db} = options;

    if (db === undefined || db === null) {
      throw new Error('The database connection is required.');
    }

    this._db = db;
  }
}
