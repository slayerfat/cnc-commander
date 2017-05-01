export class UserExistError extends Error {
  constructor(message) {
    super(message || 'User already exist.');
    Object.setPrototypeOf(this, UserExistError.prototype);
    this.name = this.constructor.name;
  }
}
