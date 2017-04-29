import { AbstractModel } from '../../../../../app/src/renderer/database/models/AbstractModel';

export class AbstractModelMock extends AbstractModel {
  constructor(validator) {
    super(validator);
  }

  static _sanitize(input) {
    return 'mocked';
  }
}
