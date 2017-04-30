import sanitizeHTML from 'sanitize-html';
import { ValidationError } from '../exceptions/ValidationError';

export class AbstractModel {
  constructor(validator) {
    if (this.constructor === AbstractModel) {
      throw new TypeError('Cannot construct abstract class.');
    }

    if (!(validator instanceof Object) || validator instanceof Array) {
      throw new TypeError('Validator must be an object.');
    }

    this._validator = validator;
    this._errors    = [];
    this._validated = false;
    this._mustImplementError = 'This method needs to be implemented';
  }

  /**
   * Sanitize a given input if theres any HTML element present.
   *
   * @param {String} input
   * @returns {String}
   * @protected
   */
  static _sanitize(input) {
    return sanitizeHTML(input, {
      allowedTags: [],
      allowedAttributes: []
    });
  }

  /**
   * Attempts to sanitize a given input.
   *
   * @param {String} input
   * @returns {String}
   * @protected
   */
  static _genericInputSanitation(input) {
    input = input.trim();

    return AbstractModel._sanitize(input);
  }

  /**
   * Checks a given input for type and throws a ValidationError if invalid.
   *
   * @param {*} input The user's input.
   * @param {String} name The name of the attribute.
   * @param {String} type The input type expected.
   * @param {Boolean} required True if input is required.
   * @throws ValidationError
   */
  static _checkInput(input, name, type = null, required = true) {
    if (required && (input === undefined || input === null)) {
      throw new ValidationError(`No ${name} was given.`);
    } else if (type !== null && typeof input !== type) {
      throw new ValidationError(`The name is expected to be a string, ${typeof input} was given.`);
    }
  }

  /**
   * Gets the simplest representation of this class instance, used by the Database.
   *
   * @returns {Object}
   */
  getSimpleObject() {
    throw new Error(this._mustImplementError);
  }

  /**
   * Validates the inputs for the model and sets an array of errors.
   *
   * @protected
   */
  _validate() {
    throw new Error(this._mustImplementError);
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
    throw new Error(this._mustImplementError);
  }

  /**
   * Check if the model is valid according to the errors.
   *
   * @returns {boolean}
   */
  hasErrors() {
    if (!this._validated) {
      this._validate();
    }

    return (this._errors.length > 0);
  }

  /**
   * Check if the model is valid according to the errors.
   *
   * @returns {boolean}
   */
  isValid() {
    return !this.hasErrors();
  }

  /**
   * Returns the errors associated with the model.
   *
   * @returns {Array}
   */
  getErrors() {
    if (!this._validated) {
      this._validate();
    }

    return this._errors;
  }

  /**
   * Resets the internal validation flag and errors array.
   *
   * @protected
   */
  _resetValidationState() {
    this._validated = false;
    this._errors    = [];
  }
}
