import db from '../connection';
import validator from 'approvejs';
import sanitizeHtml from 'sanitize-html';
import { AbstractRepository } from './abstractRepository';
import { UserExistError } from '../exceptions/UserExistError';

let instance;
let started = false;

export class UserRepository extends AbstractRepository {

  /**
   * The UserRepository class constructor.
   *
   * @param {Object} options
   * @param {String=user} options.name The database model name (or schema name)
   * @param {Object} options.validator A validator implementation
   * @param {Object} options.db The database connection
   * @param {Object} options.sanitizer A sanitizer implementation
   */
  constructor(options) {
    if (instance || !started) {
      throw new Error('Use getInstance() instead of new.');
    }

    super(options);

    this._name = options.name || 'user';

    this._validationRules = {
      name: {
        title: 'name',
        required: true,
        max: 16
      },
      email: {
        title: 'email',
        required: true,
        email: true
      },
      password: {
        title: 'password',
        required: true,
        min: 3,
        max: 16
      }
    };
  }

  /**
   * Returns the singleton of this class.
   *
   * @returns {UserRepository}
   */
  static getInstance() {
    if (instance) {
      return instance;
    }

    started  = true;
    instance = new UserRepository({db, validator, sanitizer: sanitizeHtml});

    return instance;
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
    const errors      = this._validateInputs(results);
    results.createdAt = timestamp;
    results.updatedAt = timestamp;

    return new Promise((resolve, reject) => {
      if (errors.length > 0) {
        return reject(errors);
      }

      this._isUserInDb(results).then(response => {
        if (response === true) {
          return reject(new UserExistError());
        }

        return resolve(this._db.rel.save(this._name, results));
      });
    });
  }

  /**
   * Validates the inputs for the model and returns an array of errors.
   *
   * @param data
   * @returns {Array}
   * @private
   */
  _validateInputs(data) {
    const errors = [];

    for (const key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }

      const rules = this._validationRules[key];
      if (!rules) {
        continue;
      }

      const result = this._validator.value(data[key], rules);

      if (result.approved === false) {
        errors.push(result);
      }
    }

    return errors;
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
