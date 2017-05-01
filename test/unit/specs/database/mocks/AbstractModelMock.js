import { AbstractModel } from '../../../../../app/src/renderer/database/models/AbstractModel';

export class AbstractModelMock extends AbstractModel {
  static _sanitize(input) {
    return 'mocked';
  }
}
