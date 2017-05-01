import Validator from 'validatorjs';

export class ValidatorJsValidator {

  constructor(locale = 'es') {
    this.locale = locale;
  }

  /**
   * Validates the given data according to the rules given.
   *
   * @param {*} data The data to validate.
   * @param {Object} rules The rules to guide the validation.
   */
  validate(data, rules) {
    Validator.useLang(this.locale);
    return new Validator(data, rules);
  }
}
