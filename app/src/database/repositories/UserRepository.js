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

    if (this._isUserInDb(results.name, results.email)) {
      return Promise.reject(new UserExistError());
    }

    return this._db.rel.save(this._name, results);
  }

  _isUserInDb(name, email) {
    return true;
  }
}
