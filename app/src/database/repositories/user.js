import db from '../connection';

export class UserRepository {
  constructor(options = {name: 'user'}) {
    this.db   = db;
    this.name = options.name;
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

    this._instance = new UserRepository();

    return this._instance;
  }

  /**
   * Gets all users from the database.
   *
   * @returns {Promise}
   */
  findAll() {
    return this.db.rel.find(this.name);
  }

  /**
   * Inserts a new user to the database.
   *
   * @returns {Promise}
   */
  create(name, email, password) {
    return this.db.rel.save(this.name, {
      name,
      email,
      password
    });
  }
}
