import { expect } from 'chai';
import { UserModel } from '../../../../../app/src/renderer/database/models/UserModel';
import { ValidationError } from '../../../../../app/src/renderer/database/exceptions/ValidationError';
import { ValidatorMock } from '../mocks/ValidatorMock';

/** @type UserModel */
let model;
let validatorMock;

describe('User Model', () => {
  beforeEach(() => {
    validatorMock = new ValidatorMock();

    model = new UserModel(validatorMock, 'test', 'test@test.com', 'test');
  });

  it('should be instantiated', () => {
    expect(model).to.be.an('object');
  });

  describe('the constructor', () => {
    it('throws error with no parameters', () => {
      let error;
      let obj;

      try {
        obj = new UserModel();
      } catch (err) {
        error = err;
      }

      expect(obj).to.not.be.an('object');
      expect(error).to.be.a('error');
    });

    describe('throws error when no valid name is given', () => {
      [{}, 0, 1, false, true, []].forEach(type => {
        it(`fails when ${typeof type} is given`, () => {
          let error;
          let obj;

          try {
            obj = new UserModel(validatorMock, type, 'test@test.com', 'test');
          } catch (err) {
            error = err;
          }

          expect(obj).to.not.be.an('object');
          expect(error).to.be.instanceof(ValidationError);
        });
      });
    });

    describe('throws error when no valid email is given', () => {
      [{}, 0, 1, false, true, []].forEach(type => {
        it(`fails when ${typeof type} is given`, () => {
          let error;
          let obj;

          try {
            obj = new UserModel(validatorMock, 'test', type, 'test');
          } catch (err) {
            error = err;
          }

          expect(obj).to.not.be.an('object');
          expect(error).to.be.instanceof(ValidationError);
        });
      });
    });

    describe('throws error when no valid password is given', () => {
      [{}, false, true, [], 1, 0].forEach(type => {
        it(`fails when ${typeof type} is given`, () => {
          let error;
          let obj;

          try {
            obj = new UserModel(validatorMock, 'test', 'test@test.com', type);
          } catch (err) {
            error = err;
          }

          expect(obj).to.not.be.an('object');
          expect(error).to.be.instanceof(ValidationError);
        });
      });
    });
  });

  it('should create new instance when getNewInstance is called', () => {
    const obj = UserModel.getNewInstance('test', 'test@test.com', 'test');
    expect(obj).to.be.an('object');
  });

  it('should be generate a simple model object', () => {
    const obj = model.getSimpleObject();
    expect(obj).to.be.an('object');
    expect(obj).to.have.ownProperty('name');
    expect(obj).to.have.ownProperty('email');
    expect(obj).to.have.ownProperty('password');
  });

  describe('validation', () => {
    beforeEach(() => {
      model = UserModel.getNewInstance('user', 'user@user.us', 'test');
    });

    it('should return an array of errors', () => {
      expect(model.getErrors()).to.be.instanceof(Array);
      expect(model.getErrors().length).to.equal(0);
    });

    it('should validate on re-validate when calling getErrors', () => {
      model.name  = '';
      model.email = '';
      expect(model.getErrors().length).to.be.above(0);
    });

    it('should not have errors on valid parameters', () => {
      expect(model.hasErrors()).to.be.false;
    });

    describe('should re-validate on attribute change', () => {
      it('should check name', () => {
        expect(model.hasErrors()).to.be.false;
        model.name = '';
        expect(model.hasErrors()).to.be.true;
        model.name = 'test';
        expect(model.hasErrors()).to.be.false;
      });
      it('should check email', () => {
        expect(model.hasErrors()).to.be.false;
        model.email = '';
        expect(model.hasErrors()).to.be.true;
        model.email = 'test@test.com';
        expect(model.hasErrors()).to.be.false;
      });
      it('should check password', () => {
        expect(model.hasErrors()).to.be.false;
        model.password = 'a';
        expect(model.hasErrors()).to.be.true;
        model.password = 'test';
        expect(model.hasErrors()).to.be.false;
      });
    });

    describe('invalid name', () => {
      it('should have errors on empty string', () => {
        model.name  = '';
        const array = model.getErrors();

        expect(model.hasErrors()).to.be.true;
        expect(array).to.be.instanceof(Array);
        expect(array.length).to.equal(1);

        expect(array.find(data => data === 'El campo Nombre es obligatorio.')).to.not.be.undefined;
      });

      it('should have errors on string bigger than 16 chars', () => {
        model.name  = 'someStringBiggerThat16Charsç';
        const array = model.getErrors();
        expect(model.hasErrors()).to.be.true;
        expect(array).to.be.instanceof(Array);
        expect(array.length).to.equal(2);
        let name   = array.find(data => data === 'El campo Nombre solo debe contener letras y números.');
        let length = array.find(data => data === 'El campo Nombre no debe ser mayor que 16 caracteres.');

        expect(name).to.not.be.undefined;
        expect(length).to.not.be.undefined;
      });
    });

    describe('invalid email', () => {
      it('should have errors on empty string', () => {
        model.email = '';
        const array = model.getErrors();

        expect(model.hasErrors()).to.be.true;
        expect(array).to.be.instanceof(Array);
        expect(array.length).to.equal(1);
        expect(array.find(data => data === 'El campo Email es obligatorio.')).to.not.be.undefined;
      });

      it('should have errors on invalid email', () => {
        model.email = 'test';
        const array = model.getErrors();

        expect(model.hasErrors()).to.be.true;
        expect(array).to.be.instanceof(Array);
        expect(array.length).to.equal(1);

        expect(array.find(data => data === 'El campo Email no es un correo válido')).to.not.be.undefined;
      });
    });

    describe('invalid password', () => {
      const length = 'El campo Clave tiene que estar entre  3 -  32.';

      it('should have errors on string length less 3', () => {
        model.password = '1';
        const array    = model.getErrors();

        expect(model.hasErrors()).to.be.true;
        expect(array).to.be.instanceof(Array);
        expect(array.length).to.equal(1);
        expect(array.find(data => data === length)).to.not.be.undefined;
      });

      it('should have errors on string length greater than 32', () => {
        model.password = 'someRandomStringOfMoreThan32CharsOfLength';
        const array    = model.getErrors();

        expect(model.hasErrors()).to.be.true;
        expect(array).to.be.instanceof(Array);
        expect(array.length).to.equal(1);
        expect(array.find(data => data === length)).to.not.be.undefined;
      });
    });

    it('should validate with encrypted password set', () => {
      model.password = 'someRandomStringHGc277NX5yAohXjVJECXkD.vGn3Nvj0Y72yAohXjVJEC';
      const array    = model.getErrors();

      expect(model.hasErrors()).to.be.false;
      expect(array).to.be.instanceof(Array);
      expect(array.length).to.equal(0);
    });
  });

  it('should return the encrypted password', () => {
    model.password = 'someRandomString';

    expect(model.password.length).to.equal(60);
  });
});
