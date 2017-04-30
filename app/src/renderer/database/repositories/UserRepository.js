import connection from '../connection';
import { AbstractRepository } from './abstractRepository';
import { UserExistError } from '../exceptions/UserExistError';
import { UserModel } from '../models/UserModel';

let instance;
let started = false;

export class UserRepository extends AbstractRepository {

  /**
   * The UserRepository class constructor.
   *
   * @param {Object} options
   * @param {String=user} options.name The database model name (or schema name)
   * @param {Object} options.db The database connection
   */
  constructor(options) {
    if (instance || !started) {
      throw new Error('Use getInstance() instead of new.');
    }

    super(options);

    this._name = options.name || 'user';
  }

  /**
   * Returns the singleton of this class.
   *
   * @param {Object} database The database connection.
   * @returns {UserRepository}
   */
  static getInstance(database = null) {
    if (instance) {
      return instance;
    }

    const db = database || connection();

    started  = true;
    instance = new UserRepository({db});

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
   * Gets a user from the database.
   *
   * @param {Object} selector The object representing the fields (name, password).
   * @returns {Promise}
   */
  findOne(selector) {
    return new Promise((resolve, reject) => {
      this._db.rel.find(this._name, selector).then(results => {
        if (results.users && results.users.length === 1) {
          resolve(results.users[0]);
        } else if (results.users && results.users.length > 1) {
          reject(new Error('Unknown result set from database.'));
        }

        reject(new Error('No records found.'));
      });
    });
  }

  /**
   * Gets a user from the database.
   *
   * @param {String} id The user's id.
   * @returns {Promise}
   */
  findById(id) {
    return this.findOne(id);
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
    const user = UserModel.getNewInstance(name, email, password);
    const currentRules = user.validationRules;
    currentRules.password += '|required';
    user.validationRules = currentRules;

    return new Promise((resolve, reject) => {
      if (user.hasErrors()) {
        return reject(user.getErrors());
      }

      let usrData = user.getSimpleObject();

      this._isUserInDb(usrData).then(response => {
        if (response === true) {
          return reject(new UserExistError());
        }

        return this._db.rel.save(this._name, usrData);
      }).then(results => {
        if (results.users && results.users instanceof Array) {
          return resolve(results.users[0]);
        }

        reject(new Error('Unknown result set from database.'));
      });
    });
  }

  /**
   * Inserts a new user to the database.
   *
   * @param {String} id
   * @param {String} name
   * @param {String} email
   * @param {String=} password
   * @returns {Promise}
   */
  update(id, name, email, password) {
    return new Promise((resolve, reject) => {
      this.findById(id).then(doc => {
        const user = UserModel.getNewInstance(name, email, password);

        console.debug('user found!');

        if (password === '' || password === null) {
          console.debug('no password');
          console.debug(doc);
          if (doc.password && doc.password.length !== 60) {
            console.debug('encrypting password');
            user.setEncryptedPassword(doc.password);
          }
        }

        console.debug('checking errors');
        if (user.hasErrors()) {
          console.debug('has errors!');
          console.debug(user.getErrors());
          return reject(user.getErrors());
        }

        let usrData      = user.getSimpleObject();
        usrData.withUser = true;

        this._isUserInDb(usrData).then(response => {
          if (response === true) {
            return reject(new UserExistError());
          } else if (response instanceof Object) {
            if (response.id !== doc.id) {
              return reject(new UserExistError());
            }
          }

          return resolve(this._db.rel.save(this._name, usrData));
        });
      }).catch(err => reject(err));
    });
  }

  /**
   * Finds a doc or group of docs according to the options.
   *
   * @param {Object} options The options object
   * @returns {Promise}
   */
  findRaw(options) {
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
   * @param {Boolean} options.withUser If true, this method returns the user if available.
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

    return this.findRaw(selector).then(results => {
      if (results.users.length === 1 && options.withUser === true) {
        return Promise.resolve(results.users);
      } else if (results.users.length > 0) {
        Promise.resolve(true);
      }

      Promise.resolve(false);
    });
  }
}
