import { expect } from 'chai';
import { AbstractModel } from '../../../../../app/src/renderer/database/models/AbstractModel';
import { ValidatorMock } from '../mocks/ValidatorMock';
import { AbstractModelMock } from '../mocks/AbstractModelMock';

/** @type AbstractModel */
let model;
let validatorMock;

describe('Abstract model', () => {
  beforeEach(() => {
    validatorMock = new ValidatorMock();

    model = new AbstractModelMock(validatorMock);
  });

  it('should be instantiated', () => {
    expect(model).to.be.an('object');
  });

  it('should not be instantiated', () => {
    let error;
    let obj;

    try {
      obj = new AbstractModel(validatorMock);
    } catch (err) {
      error = err;
    }

    expect(obj).to.not.be.an('object');
    expect(error).to.be.instanceof(TypeError);
  });

  describe('asking for implementation', () => {
    it('isValid should throw error', () => {
      expect(model.isValid.bind(model)).to.throw(Error, /This method needs to be implemented/);
    });

    it('hasErrors should throw error', () => {
      expect(model.hasErrors.bind(model)).to.throw(Error, /This method needs to be implemented/);
    });

    it('getErrors should throw error', () => {
      expect(model.getErrors.bind(model)).to.throw(Error, /This method needs to be implemented/);
    });

    it('getSimpleObject should throw error', () => {
      expect(model.getSimpleObject.bind(model)).to.throw(Error, /This method needs to be implemented/);
    });
  });

  describe('throws error when no valid validator is given', () => {
    ['string', 0, 1, false, true, []].forEach(type => {
      it(`fails when ${typeof type} is given`, () => {
        let error;
        let obj;

        try {
          obj = new AbstractModelMock(type);
        } catch (err) {
          error = err;
        }

        expect(obj).to.not.be.an('object');
        expect(error).to.be.instanceof(TypeError);
      });
    });
  });
});
