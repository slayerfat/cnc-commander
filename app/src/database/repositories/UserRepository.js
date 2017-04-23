import db from '../connection';
import validator from 'validator';
import { AbstractRepository } from './abstractRepository';
import { UserExistError } from '../exceptions/UserExistError';

export class UserRepository extends AbstractRepository {

  /**
   * The UserRepository class constructor.
   *
   * @param {Object} options
   * @param {String=user} options.name The database model name (or schema name)
   * @param {Object} options.validator A validator implementation
   * @param {Object} options.db The database connection
   */
  constructor(options) {
    super(options);

    this._name = options.name || 'user';
  }

  /**
   * Returns the singleton of this class.
   *
   * @returns {UserRepository}
   */
  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new UserRepository({db, validator});

    return this._instance;
  }

  /**
   * Gets all users from the database.
   *
   * @returns {Promise}
   */
  findAll() {
    return this._db.rel.find(this._name);
  }

  /**
   * Inserts a new user to the database.
   *
   * @param {String} name
   * @param {String} email
   * @param {String} password
   * @returns {Promise}
   */
  create(name, email, password) {
    const timestamp   = new Date();
    const results     = this._sanitize({name, email, password});
    results.createdAt = timestamp;
    results.updatedAt = timestamp;

    return new Promise((resolve, reject) => {
      this._isUserInDb(results).then(response => {
        if (response === true) {
          return reject(new UserExistError());
        }

        return this._db.rel.save(this._name, results);
      });
    });
  }

  /**
   * Finds a doc or group of docs according to the options.
   *
   * @param {Object} options The options object
   * @returns {Promise}
   */
  find(options) {
    return new Promise((resolve, reject) => {
      // We find a plain result from the database
      this._db.find(options).then(results => {
        if (results.docs.length === 0) {
          return resolve({users: []});
        }

        // we have to map the results to parse the raw IDs from the
        // database into the relational plugin format
        const arr = results.docs
          .map(doc => this._db.rel.parseDocID(doc._id))
          .map(doc => doc.id);

        // finds the relational doc
        return this._db.rel.find(this._name, arr);
      }).then(results => resolve(results)).catch(err => reject(err));
    });
  }

  /**
   * Check if the given name or email are associated to an user.
   *
   * @param {Object} options
   * @param {String} options.name
   * @param {String} options.email
   * @returns {Promise}
   * @private
   */
  _isUserInDb(options) {
    const selector = {
      selector: {
        '$or': [
          {'data.name': options.name || ''},
          {'data.email': options.email || ''}
        ]
      }
    };

    return this.find(selector).then(results => Promise.resolve((results.users.length === 1)));
  }
}
