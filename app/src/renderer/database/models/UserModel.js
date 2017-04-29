import { AbstractModel } from './AbstractModel';
import { ValidationError } from '../exceptions/ValidationError';
import { ValidatorJsValidator } from '../../helpers/ValidatorJsValidator';

const bcrypt = require('bcryptjs');

export class UserModel extends AbstractModel {

  /**
   * The user model constructor.
   *
   * @param {Object} validator A validator implementation
   * @param {String} name The user's name
   * @param {String} email The user's email
   * @param {String} password The user's password
   * @param {Date=} createdAt The user model created date
   * @param {Date=} updatedAt The user model updated date
   */
  constructor(validator, name, email, password, createdAt, updatedAt) {
    super(validator);

    this.name      = name;
    this.email     = email;
    this.password  = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this._validationRules = {
      name: 'alpha_num|required|max:16',
      email: 'email|required',
      password: 'between: 3, 32'
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
    const validator = new ValidatorJsValidator();
    return new UserModel(validator, name, email, password);
  }

  /**
   * Encrypts and returns the hashed password string with bcrypt.
   *
   * @param {String} password
   * @returns {String} The password hash
   */
  static encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * Compares a password with a hash, returns true if they do.
   *
   * @param {String} password
   * @param {String} hash
   * @returns {Boolean}
   */
  static isPasswordMatch(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  /**
   * @param {String} input
   */
  set name(input) {
    this._resetValidationState();

    AbstractModel._checkInput(input, 'name', 'string');

    this._name = UserModel._genericInputSanitation(input);
  }

  /**
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * @param {String} input
   */
  set email(input) {
    this._resetValidationState();

    AbstractModel._checkInput(input, 'name', 'string');

    this._email = UserModel._genericInputSanitation(input);
  }

  /**
   * @returns {String}
   */
  get email() {
    return this._email;
  }

  /**
   * Sets the model password with bcrypt encryption.
   *
   * @param {String} input
   */
  set password(input) {
    this._resetValidationState();

    AbstractModel._checkInput(input, 'password', 'string', false);

    if (input.length === 60) {
      this.encryptedPassword = input;

      return;
    }

    this._password          = input;
    this._encryptedPassword = UserModel.encryptPassword(UserModel._genericInputSanitation(input));
  }

  /**
   * @returns {String}
   */
  get password() {
    return this._encryptedPassword;
  }

  /**
   * Sets the encrypted password.
   *
   * @param {String} password
   */
  set encryptedPassword(password) {
    if (!password) {
      throw new ValidationError('Password cannot be empty or null.');
    } else if (password.length !== 60) {
      throw new ValidationError('Invalid password length.');
    }
    this._encryptedPassword = password;
  }

  /**
   * @returns {String}
   */
  get encryptedPassword() {
    return this._encryptedPassword;
  }

  /**
   * @return {Date}
   */
  get createdAt() {
    return this._createdAt;
  }

  /**
   * Sets the created at.
   *
   * @param {Date} date
   */
  set createdAt(date) {
    this._createdAt = date || new Date();
  }

  /**
   * @return {Date}
   */
  get updatedAt() {
    return this._updatedAt;
  }

  /**
   * Sets the updated at.
   *
   * @param {Date} date
   */
  set updatedAt(date) {
    this._updatedAt = date || new Date();
  }

  /**
   * Gets the simplest representation of this class instance, used by the Database.
   *
   * @returns {Object}
   */
  getSimpleObject() {
    return Object.assign({}, {
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
  }

  /**
   * Validates the inputs for the model and sets an array of errors.
   *
   * @protected
   */
  _validate() {
    const validation = this._validator.validate({
      name: this.name,
      email: this.email,
      password: this._password
    }, this._validationRules);

    validation.setAttributeNames({
      name: 'Nombre',
      email: 'Email',
      password: 'Clave'
    });

    if (validation.fails()) {
      const errors = validation.errors.all();
      Object.keys(errors).forEach(name => {
        errors[name].forEach(error => this._errors.push(error));
      });
    }

    this._validated = true;
  }
}
