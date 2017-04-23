export class UserExistError extends Error {
  constructor() {
    super();
    this.name    = 'UserExistError';
    this.message = 'User already exist.';
  }
}
