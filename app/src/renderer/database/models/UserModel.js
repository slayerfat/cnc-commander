import { AbstractModel } from './AbstractModel';
import { ApproveValidator } from '../../helpers/ApproveValidator';
import approve from 'approvejs';

const bcrypt = require('bcryptjs');

export class UserModel extends AbstractModel {

  /**
   * The user model constructor.
   *
   * @param {Object} validator A validator implementation
   * @param {String} name The user's name
   * @param {String} email The user's email
   * @param {String} password The user's password
   */
  constructor(validator, name, email, password) {
    super(validator);

    this.setName(name);
    this.setEmail(email);
    this.setPassword(password);

    const timestamp = new Date();
    this._createdAt = this._updatedAt = timestamp;

    this._validationRules = {
      _name: {
        title: 'name',
        required: true,
        max: 16
      },
      _email: {
        title: 'email',
        required: true,
        email: true
      },
      _password: {
        title: 'password',
        required: true,
        min: 3,
        max: 16
      }
    };
  }

  /**
   * Creates a new UserModel instance with the required dependencies.
   *
   * @param {String} name The user's name
   * @param {String} email The user's email
   * @param {String} password The user's password
   * @returns {UserModel}
   */
  static getNewInstance(name, email, password) {
    const validator = new ApproveValidator(approve);
    return new UserModel(validator, name, email, password);
  }

  /**
   * Encrypts and returns the hashed password string with bcrypt.
   *
   * @param {String} password
   * @returns {String} The password hash
   * @private
   */
  static _encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * Compares a password with a hash, returns true if they do.
   *
   * @param {String} password
   * @param {String} hash
   * @returns {Boolean}
   * @private
   */
  static _isPasswordMatch(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  setName(input) {
    this._validated = false;

    this._name = UserModel._genericInputSanitation(input);
  }

  getName() {
    return this._name;
  }

  setEmail(input) {
    this._validated = false;

    this._email = UserModel._genericInputSanitation(input);
  }

  getEmail() {
    return this._email;
  }

  /**
   * Sets the model password with bcrypt encryption.
   *
   * @param {String} input
   */
  setPassword(input) {
    this._validated        = false;
    this._password         = input;
    this._enryptedPassword = UserModel._encryptPassword(UserModel._genericInputSanitation(input));
  }

  getPassword() {
    return this._enryptedPassword;
  }

  getCreatedAt() {
    return this._createdAt;
  }

  getUpdatedAt() {
    return this._updatedAt;
  }

  /**
   * Gets the simplest representation of this class instance, used by the Database.
   *
   * @returns {Object}
   */
  getSimpleObject() {
    return Object.assign({}, {
      name: this.getName(),
      email: this.getEmail(),
      password: this.getPassword(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt()
    });
  }

  /**
   * Returns the set of rules associated with the given key or name.
   *
   * @param key The key inside the validationRules object.
   *
   * @returns {Object}
   * @protected
   */
  _getValidationRules(key) {
    return this._validationRules[key];
  }
}
