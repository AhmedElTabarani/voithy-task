const chai = require('chai');
const chaiHTTP = require('chai-http');
const Patient = require('../models/patient.model');

let server = require('../server');

chai.use(chaiHTTP);

const should = chai.should();

const testPatient = {
  name: 'patient',
  email: 'patient@deal.com',
  password: '123456789',
  dateOfBirth: new Date().toISOString(),
  gender: 'male',
};
describe('> Patient Operations', async () => {
  before(async () => {
    await Patient.deleteMany({});
    server = await server;
  });
  afterEach(() => {
    return Patient.deleteMany({});
  });
  describe('> Signup a patient', () => {
    it('should signup a patient', (done) => {
      chai
        .request(server)
        .post('/api/patients/signup')
        .send(testPatient)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.all.keys(['status', 'data', 'token']);
          res.body.status.should.be.a('string').eql('success');
          res.body.token.should.be.a('string');
          res.body.data.should.include.all.keys([
            'name',
            'email',
            'dateOfBirth',
            'gender',
          ]);
          res.body.data.should.have
            .property('name')
            .eql(testPatient.name);
          res.body.data.should.have
            .property('email')
            .eql(testPatient.email);
          res.body.data.should.have
            .property('dateOfBirth')
            .eql(testPatient.dateOfBirth);
          done();
        });
    });
    it('should not signup a patient with an existing email', (done) => {
      Patient.create(testPatient).then(() => {
        chai
          .request(server)
          .post('/api/patients/signup')
          .send(testPatient)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.include.all.keys(['status', 'message']);
            res.body.status.should.be.a('string').eql('fail');
            res.body.message.should.be
              .a('string')
              .eql('Duplicate field value: email');
            done();
          });
      });
    });
  });
  describe('> Login a patient', () => {
    it('should login a patient', (done) => {
      Patient.create(testPatient).then(() => {
        chai
          .request(server)
          .post('/api/patients/login')
          .send({
            email: testPatient.email,
            password: testPatient.password,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.all.keys([
              'status',
              'data',
              'token',
            ]);
            res.body.status.should.be.a('string').eql('success');
            res.body.token.should.be.a('string');
            res.body.data.should.include.all.keys([
              'name',
              'email',
              'dateOfBirth',
              'gender',
            ]);
            res.body.data.should.have
              .property('name')
              .eql(testPatient.name);
            res.body.data.should.have
              .property('email')
              .eql(testPatient.email);
            res.body.data.should.have
              .property('dateOfBirth')
              .eql(testPatient.dateOfBirth);
            done();
          });
      });
    });
    it('should not login a patient with wrong email', (done) => {
      Patient.create(testPatient).then(() => {
        chai
          .request(server)
          .post('/api/patients/login')
          .send({
            email: testPatient.email,
            password: 'wrong password',
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.include.all.keys(['status', 'message']);
            res.body.status.should.be.a('string').eql('fail');
            res.body.message.should.be
              .a('string')
              .eql('Email or password is incorrect');
            done();
          });
      });
    });
  });
  describe('> Get me', () => {
    it('should get the current logged in patient', (done) => {
      Patient.create(testPatient).then(() => {
        chai
          .request(server)
          .post('/api/patients/login')
          .send({
            email: testPatient.email,
            password: testPatient.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .get('/api/patients/me')
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.all.keys(['status', 'data']);
                res.body.status.should.be.a('string').eql('success');
                res.body.data.should.include.all.keys([
                  'name',
                  'email',
                  'dateOfBirth',
                  'gender',
                ]);
                res.body.data.should.have
                  .property('name')
                  .eql(testPatient.name);
                res.body.data.should.have
                  .property('email')
                  .eql(testPatient.email);
                res.body.data.should.have
                  .property('dateOfBirth')
                  .eql(testPatient.dateOfBirth);
                done();
              });
          });
      });
    });
    it('should not get the current logged in patient without token', (done) => {
      chai
        .request(server)
        .get('/api/patients/me')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.include.all.keys(['status', 'message']);
          res.body.status.should.be.a('string').eql('fail');
          res.body.message.should.be
            .a('string')
            .eql('Access denied, No token provided');
          done();
        });
    });
  });
  describe('> Update me', () => {
    it('should update the current logged in patient', (done) => {
      Patient.create(testPatient).then(() => {
        chai
          .request(server)
          .post('/api/patients/login')
          .send({
            email: testPatient.email,
            password: testPatient.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/patients/me')
              .set('authorization', `Bearer ${token}`)
              .send({
                name: 'new name',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.all.keys(['status', 'data']);
                res.body.status.should.be.a('string').eql('success');
                res.body.data.should.include.all.keys([
                  'name',
                  'email',
                  'dateOfBirth',
                  'gender',
                ]);
                res.body.data.should.have
                  .property('name')
                  .eql('new name');
                res.body.data.should.have
                  .property('email')
                  .eql(testPatient.email);
                res.body.data.should.have
                  .property('dateOfBirth')
                  .eql(testPatient.dateOfBirth);
                done();
              });
          });
      });
    });
    it('should not update the current logged in patient without token', (done) => {
      chai
        .request(server)
        .patch('/api/patients/me')
        .send({
          name: 'new name',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.include.all.keys(['status', 'message']);
          res.body.status.should.be.a('string').eql('fail');
          res.body.message.should.be
            .a('string')
            .eql('Access denied, No token provided');
          done();
        });
    });
  });
  describe('> Change Password', () => {
    it('should change the password of the current logged in patient', (done) => {
      Patient.create(testPatient).then(() => {
        chai
          .request(server)
          .post('/api/patients/login')
          .send({
            email: testPatient.email,
            password: testPatient.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/patients/changePassword')
              .set('authorization', `Bearer ${token}`)
              .send({
                oldPassword: testPatient.password,
                newPassword: 'new password',
              })
              .end((err, res) => {
                res.body.should.have.all.keys(['status', 'data']);
                res.body.status.should.be.a('string').eql('success');
                res.body.data.should.include.all.keys([
                  'name',
                  'email',
                  'dateOfBirth',
                  'gender',
                ]);
                res.body.data.should.have
                  .property('name')
                  .eql(testPatient.name);
                res.body.data.should.have
                  .property('email')
                  .eql(testPatient.email);
                res.body.data.should.have
                  .property('dateOfBirth')
                  .eql(testPatient.dateOfBirth);
                done();
              });
          });
      });
    });
    it('should login with new password', (done) => {
      Patient.create(testPatient).then(() => {
        chai
          .request(server)
          .post('/api/patients/login')
          .send({
            email: testPatient.email,
            password: testPatient.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/patients/changePassword')
              .set('authorization', `Bearer ${token}`)
              .send({
                oldPassword: testPatient.password,
                newPassword: 'new password',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include.all.keys(['status']);
                res.body.status.should.be.a('string').eql('success');
                chai
                  .request(server)
                  .post('/api/patients/login')
                  .send({
                    email: testPatient.email,
                    password: 'new password',
                  })
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.include.all.keys(['status']);
                    res.body.status.should.be
                      .a('string')
                      .eql('success');
                    done();
                  });
              });
          });
      });
    });
    it('should not change the password of the current logged in patient without token', (done) => {
      chai
        .request(server)
        .patch('/api/patients/changePassword')
        .send({
          oldPassword: testPatient.password,
          newPassword: 'new password',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.include.all.keys(['status', 'message']);
          res.body.status.should.be.a('string').eql('fail');
          res.body.message.should.be
            .a('string')
            .eql('Access denied, No token provided');
          done();
        });
    });
    it('should not perform any auth operation after change password', (done) => {
      Patient.create(testPatient).then(() => {
        chai
          .request(server)
          .post('/api/patients/login')
          .send({
            email: testPatient.email,
            password: testPatient.password,
          })
          .end(async (err, res) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/patients/changePassword')
              .set('authorization', `Bearer ${token}`)
              .send({
                oldPassword: testPatient.password,
                newPassword: 'new password',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include.all.keys(['status']);
                res.body.status.should.be.a('string').eql('success');
                chai
                  .request(server)
                  .get('/api/patients/me')
                  .set('authorization', `Bearer ${token}`)
                  .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.include.all.keys([
                      'status',
                      'message',
                    ]);
                    res.body.status.should.be.a('string').eql('fail');
                    res.body.message.should.be
                      .a('string')
                      .eql(
                        'This user changed his password, Please login again'
                      );
                    done();
                  });
              });
          });
      });
    });
    it('should perform any auth operation when login again', (done) => {
      Patient.create(testPatient).then(() => {
        chai
          .request(server)
          .post('/api/patients/login')
          .send({
            email: testPatient.email,
            password: testPatient.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/patients/changePassword')
              .set('authorization', `Bearer ${token}`)
              .send({
                oldPassword: testPatient.password,
                newPassword: 'new password',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include.all.keys(['status']);
                res.body.status.should.be.a('string').eql('success');
                chai
                  .request(server)
                  .post('/api/patients/login')
                  .send({
                    email: testPatient.email,
                    password: 'new password',
                  })
                  .end((err, res) => {
                    const token = res.body.token;
                    chai
                      .request(server)
                      .get('/api/patients/me')
                      .set('authorization', `Bearer ${token}`)
                      .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.all.keys([
                          'status',
                          'data',
                        ]);
                        res.body.status.should.be
                          .a('string')
                          .eql('success');
                        res.body.data.should.include.all.keys([
                          'name',
                          'email',
                          'dateOfBirth',
                          'gender',
                        ]);
                        res.body.data.should.have
                          .property('name')
                          .eql(testPatient.name);
                        res.body.data.should.have
                          .property('email')
                          .eql(testPatient.email);
                        res.body.data.should.have
                          .property('dateOfBirth')
                          .eql(testPatient.dateOfBirth);
                        done();
                      });
                  });
              });
          });
      });
    });
  });
});
