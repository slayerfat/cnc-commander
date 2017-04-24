import sanitizeHTML from 'sanitize-html';

export class AbstractModel {
  constructor(validator) {
    if (this.constructor === AbstractModel) {
      throw new TypeError('Cannot construct abstract class.');
    }

    this._validator = validator;
    this._errors    = [];
    this._validated = false;
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
   * Gets the simplest representation of this class instance, used by the Database.
   *
   * @returns {Object}
   */
  getSimpleObject() {
    throw new Error('This method needs to be implemented');
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
    return this.hasErrors();
  }

  /**
   * Returns the errors associated with the model.
   *
   * @returns {Array}
   */
  getErrors() {
    return this._errors;
  }

  /**
   * Validates the inputs for the model and returns an array of errors.
   *
   * @returns {Array}
   * @protected
   */
  _validate() {
    for (const key in this) {
      if (!this.hasOwnProperty(key)) {
        continue;
      }

      const rules = this._getValidationRules(key);
      if (!rules) {
        continue;
      }

      const result = this._validator.validate(this[key], rules);

      if (result.approved === false) {
        this._errors.push(result);
      }
    }

    this._validated = true;
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
    throw new Error('This method needs to be implemented.');
  }
}
