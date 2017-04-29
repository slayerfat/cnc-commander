export class ValidationError extends Error {
  constructor(message) {
    super(message || 'Unspecified validation error.');
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = this.constructor.name;
  }
}
