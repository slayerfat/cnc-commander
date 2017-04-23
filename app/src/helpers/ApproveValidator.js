export class ApproveValidator {

  /**
   * The class constructor.
   *
   * @param {Object} approve The approvejs library.
   */
  constructor(approve) {
    this._approve = approve;
  }

  /**
   * Validates the given data according to the rules given.
   *
   * @param {*} data The data to validate.
   * @param {Object} rules The rules to guide the validation.
   */
  validate(data, rules) {
    return this._approve.value(data, rules);
  }
}
