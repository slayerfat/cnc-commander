import { expect } from 'chai';
import { UserRepository } from '../../../../../app/src/renderer/database/repositories/UserRepository';
import connection from '../../../../../app/src/renderer/database/connection';

/** @type UserRepository */
let repo;
let db = connection('test', 'memory');

describe('User Repository', () => {
  const resetDatabase = function(docs) {
    const promises = [];
    docs.users.forEach(user => promises.push(db.rel.del('user', user)));

    return Promise.all(promises);
  };

  beforeEach(() => repo = UserRepository.getInstance(db));

  afterEach(done => {
    db.rel.find('user')
      .then(resetDatabase)
      .then(() => done())
      .catch(err => console.error(err));
  });

  it('should not be instantiated', () => {
    let error;
    let obj;

    try {
      obj = new UserRepository();
    } catch (err) {
      error = err;
    }

    expect(obj).to.not.be.an('object');
    expect(error).to.be.instanceof(Error);
    expect(error.message).to.eq('Use getInstance() instead of new.');
  });

  it('should be the same instance', () => {
    expect(UserRepository.getInstance()).to.equal(repo);
  });

  describe('findById()', () => {
    it('should find a recently created document', done => {
      repo.create('findById', 'test@test.com', 'test')
        .then(doc => repo.findById(doc.id))
        .then(doc => {
          expect(doc).to.be.instanceof(Object);
          expect(doc).to.have.property('name')
            .that.equals('findById');
          expect(doc).to.have.property('email')
            .that.equals('test@test.com');

          done();
        }).catch(err => done(err));
    });
  });

  describe('findOne()', () => {
    it('should find a recently created document', done => {
      repo.create('findOne', 'test@test.com', 'test')
        .then(doc => repo.findOne({name: 'findOne'}))
        .then(doc => {
          expect(doc).to.be.instanceof(Object);
          expect(doc).to.have.property('name')
            .that.equals('findOne');
          expect(doc).to.have.property('email')
            .that.equals('test@test.com');

          done();
        }).catch(err => done(err));
    });
  });

  describe('findRaw()', () => {
    xit('should find a recently created document', done => {
      repo.create('test', 'test@test.com', 'test')
        .then(doc => repo.findRaw({
          selector: {
            name: 'test'
          }
        }))
        .then(doc => {
          expect(doc).to.be.instanceof(Object);
          expect(doc).to.have.property('name')
            .that.equals('test');
          expect(doc).to.have.property('email')
            .that.equals('test@test.com');

          done();
        }).catch(err => done(err));
    });
  });

  describe('create()', () => {
    it('should create a new document', done => {
      repo.create('test', 'test@test.com', 'test').then(results => {
        expect(results).to.be.instanceof(Object);
        expect(results).to.have.property('name').that.equal('test');
        expect(results).to.have.property('email').that.equal('test@test.com');
        expect(results).to.have.property('password').with.lengthOf(60);

        return repo.create('another', 'another@test.com', 'test');
      }).then(results => {
        expect(results).to.be.instanceof(Object);
        expect(results).to.have.property('name').that.equal('another');
        expect(results).to.have.property('email').that.equal('another@test.com');
        expect(results).to.have.property('password').with.lengthOf(60);

        return db.rel.find('user');
      }).then(results => {
        expect(results).to.be.instanceof(Object);
        expect(results).to.have.property('users');
        expect(results.users).to.be.instanceof(Array);
        expect(results.users.length).to.equal(2);

        done();
      }).catch(err => done(err));
    });

    xit('should throw UserExistError if user already exist on DB', done => {
      const promises = [
        repo.create('test1', 'test1@test.com', 'test'),
        repo.create('test2', 'test2@test.com', 'test'),
        repo.create('test3', 'test3@test.com', 'test')
      ];
      Promise.all(promises)
        .then(results => db.rel.find('user'))
        .then(results => {
          expect(results).to.be.instanceof(Object);
          expect(results).to.have.property('users');
          expect(results.users).to.be.instanceof(Array);
          expect(results.users.length).to.equal(3);

          done();
        }).catch(err => done(err));
    });

    describe('wont persist if errors occur', () => {
      const handleSuccessAsError = function(results, done) {
        // inverted cases thx to the validation logic in promise.
        // these results should not be valid.
        done(new Error('Create should not persist on database.'));
      };

      it('fails on empty name', done => {
        repo.create('', 'test@test.com', 'test')
          .then(results => handleSuccessAsError(results, done))
          .catch(results => {
            expect(results).to.be.instanceof(Array);
            expect(results).with.lengthOf(1);
            expect(results[0]).to.equal('El campo Nombre es obligatorio.');

            return db.rel.find('user');
          })
          .then(results => {
            expect(results).to.be.instanceof(Object);
            expect(results).to.have.property('users');
            expect(results.users).to.be.instanceof(Array);
            expect(results.users.length).to.equal(0);

            done();
          }).catch(err => done(err));
      });

      it('fails on invalid name', done => {
        repo.create('someRandomStringWithErrors.ç<', 'test@test.com', 'test')
          .then(results => handleSuccessAsError(results, done))
          .catch(results => {
            expect(results).to.be.instanceof(Array);
            expect(results).with.lengthOf(2);
            expect(results).to.have.members([
              'El campo Nombre solo debe contener letras y números.',
              'El campo Nombre no debe ser mayor que 16 caracteres.'
            ]);

            return db.rel.find('user');
          })
          .then(results => {
            expect(results).to.be.instanceof(Object);
            expect(results).to.have.property('users');
            expect(results.users).to.be.instanceof(Array);
            expect(results.users.length).to.equal(0);

            done();
          }).catch(err => done(err));
      });

      it('fails on empty email', done => {
        repo.create('test', '', 'test')
          .then(results => handleSuccessAsError(results, done))
          .catch(results => {
            expect(results).to.be.instanceof(Array);
            expect(results).with.lengthOf(1);
            expect(results[0]).to.equal('El campo Email es obligatorio.');

            return db.rel.find('user');
          })
          .then(results => {
            expect(results).to.be.instanceof(Object);
            expect(results).to.have.property('users');
            expect(results.users).to.be.instanceof(Array);
            expect(results.users.length).to.equal(0);

            done();
          }).catch(err => done(err));
      });

      it('fails on invalid email', done => {
        repo.create('test', 'test@test', 'test')
          .then(results => handleSuccessAsError(results, done))
          .catch(results => {
            expect(results).to.be.instanceof(Array);
            expect(results).with.lengthOf(1);
            expect(results[0]).to.equal('El campo Email no es un correo válido');

            return db.rel.find('user');
          })
          .then(results => {
            expect(results).to.be.instanceof(Object);
            expect(results).to.have.property('users');
            expect(results.users).to.be.instanceof(Array);
            expect(results.users.length).to.equal(0);

            done();
          }).catch(err => done(err));
      });

      it('fails on empty password', done => {
        repo.create('test', 'test@test.com', '')
          .then(results => handleSuccessAsError(results, done))
          .catch(results => {
            expect(results).to.be.instanceof(Array);
            expect(results).with.lengthOf(1);
            expect(results[0]).to.equal('El campo Clave es obligatorio.');

            return db.rel.find('user');
          })
          .then(results => {
            expect(results).to.be.instanceof(Object);
            expect(results).to.have.property('users');
            expect(results.users).to.be.instanceof(Array);
            expect(results.users.length).to.equal(0);

            done();
          }).catch(err => done(err.message));
      });

      it('fails on invalid password', done => {
        repo.create('test', 'test@test.com', '12')
          .then(results => handleSuccessAsError(results, done))
          .catch(results => {
            expect(results).to.be.instanceof(Array);
            expect(results).with.lengthOf(1);
            expect(results[0]).to.equal('El campo Clave tiene que estar entre  3 -  32.');

            return db.rel.find('user');
          })
          .then(results => {
            expect(results).to.be.instanceof(Object);
            expect(results).to.have.property('users');
            expect(results.users).to.be.instanceof(Array);
            expect(results.users.length).to.equal(0);

            done();
          }).catch(err => done(err));
      });
    });
  });
});
