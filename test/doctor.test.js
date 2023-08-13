const chai = require('chai');
const chaiHTTP = require('chai-http');
const Doctor = require('../models/doctor.model');

let server = require('../server');

chai.use(chaiHTTP);

const should = chai.should();

const testDoctor = {
  name: 'doctor',
  email: 'doctor@deal.com',
  password: '123456789',
  phone: '01000000000',
  specialty: 'cardiology',
};
describe('> Doctor Operations', async () => {
  before(async () => {
    await Doctor.deleteMany({});
    server = await server;
  });
  afterEach(() => {
    return Doctor.deleteMany({});
  });
  describe('> Signup a doctor', () => {
    it('should signup a doctor', (done) => {
      chai
        .request(server)
        .post('/api/doctors/signup')
        .send(testDoctor)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.all.keys(['status', 'data', 'token']);
          res.body.status.should.be.a('string').eql('success');
          res.body.token.should.be.a('string');
          res.body.data.should.include.all.keys([
            'name',
            'email',
            'phone',
            'specialty',
          ]);
          res.body.data.should.have
            .property('name')
            .eql(testDoctor.name);
          res.body.data.should.have
            .property('email')
            .eql(testDoctor.email);
          res.body.data.should.have
            .property('phone')
            .eql(testDoctor.phone);
          res.body.data.should.have
            .property('specialty')
            .eql(testDoctor.specialty);
          done();
        });
    });
    it('should not signup a doctor with an existing email', (done) => {
      Doctor.create(testDoctor).then(() => {
        chai
          .request(server)
          .post('/api/doctors/signup')
          .send(testDoctor)
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
  describe('> Login a doctor', () => {
    it('should login a doctor', (done) => {
      Doctor.create(testDoctor).then(() => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
            password: testDoctor.password,
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
              'phone',
              'specialty',
            ]);
            res.body.data.should.have
              .property('name')
              .eql(testDoctor.name);
            res.body.data.should.have
              .property('email')
              .eql(testDoctor.email);
            res.body.data.should.have
              .property('phone')
              .eql(testDoctor.phone);
            res.body.data.should.have
              .property('specialty')
              .eql(testDoctor.specialty);
            done();
          });
      });
    });
    it('should not login a doctor with wrong email', (done) => {
      Doctor.create(testDoctor).then(() => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
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
    it('should get the current logged in doctor', (done) => {
      Doctor.create(testDoctor).then(() => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
            password: testDoctor.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .get('/api/doctors/me')
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.all.keys(['status', 'data']);
                res.body.status.should.be.a('string').eql('success');
                res.body.data.should.include.all.keys([
                  'name',
                  'email',
                  'phone',
                  'specialty',
                ]);
                res.body.data.should.have
                  .property('name')
                  .eql(testDoctor.name);
                res.body.data.should.have
                  .property('email')
                  .eql(testDoctor.email);
                res.body.data.should.have
                  .property('phone')
                  .eql(testDoctor.phone);
                res.body.data.should.have
                  .property('specialty')
                  .eql(testDoctor.specialty);
                done();
              });
          });
      });
    });
    it('should not get the current logged in doctor without token', (done) => {
      chai
        .request(server)
        .get('/api/doctors/me')
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
    it('should update the current logged in doctor', (done) => {
      Doctor.create(testDoctor).then(() => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
            password: testDoctor.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/doctors/me')
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
                  'phone',
                  'specialty',
                ]);
                res.body.data.should.have
                  .property('name')
                  .eql('new name');
                res.body.data.should.have
                  .property('email')
                  .eql(testDoctor.email);
                  res.body.data.should.have
                  .property('phone')
                  .eql(testDoctor.phone);
                res.body.data.should.have
                  .property('specialty')
                  .eql(testDoctor.specialty);
                done();
              });
          });
      });
    });
    it('should not update the current logged in doctor without token', (done) => {
      chai
        .request(server)
        .patch('/api/doctors/me')
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
    it('should change the password of the current logged in doctor', (done) => {
      Doctor.create(testDoctor).then(() => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
            password: testDoctor.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/doctors/changePassword')
              .set('authorization', `Bearer ${token}`)
              .send({
                oldPassword: testDoctor.password,
                newPassword: 'new password',
              })
              .end((err, res) => {
                res.body.should.have.all.keys(['status', 'data']);
                res.body.status.should.be.a('string').eql('success');
                res.body.data.should.include.all.keys([
                  'name',
                  'email',
                  'phone',
                  'specialty',
                ]);
                res.body.data.should.have
                  .property('name')
                  .eql(testDoctor.name);
                res.body.data.should.have
                  .property('email')
                  .eql(testDoctor.email);
                res.body.data.should.have
                  .property('phone')
                  .eql(testDoctor.phone);
                res.body.data.should.have
                  .property('specialty')
                  .eql(testDoctor.specialty);
                done();
              });
          });
      });
    });
    it('should login with new password', (done) => {
      Doctor.create(testDoctor).then(() => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
            password: testDoctor.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/doctors/changePassword')
              .set('authorization', `Bearer ${token}`)
              .send({
                oldPassword: testDoctor.password,
                newPassword: 'new password',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include.all.keys(['status']);
                res.body.status.should.be.a('string').eql('success');
                chai
                  .request(server)
                  .post('/api/doctors/login')
                  .send({
                    email: testDoctor.email,
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
    it('should not change the password of the current logged in doctor without token', (done) => {
      chai
        .request(server)
        .patch('/api/doctors/changePassword')
        .send({
          oldPassword: testDoctor.password,
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
      Doctor.create(testDoctor).then(() => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
            password: testDoctor.password,
          })
          .end(async (err, res) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/doctors/changePassword')
              .set('authorization', `Bearer ${token}`)
              .send({
                oldPassword: testDoctor.password,
                newPassword: 'new password',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include.all.keys(['status']);
                res.body.status.should.be.a('string').eql('success');
                chai
                  .request(server)
                  .get('/api/doctors/me')
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
      Doctor.create(testDoctor).then(() => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
            password: testDoctor.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            chai
              .request(server)
              .patch('/api/doctors/changePassword')
              .set('authorization', `Bearer ${token}`)
              .send({
                oldPassword: testDoctor.password,
                newPassword: 'new password',
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include.all.keys(['status']);
                res.body.status.should.be.a('string').eql('success');
                chai
                  .request(server)
                  .post('/api/doctors/login')
                  .send({
                    email: testDoctor.email,
                    password: 'new password',
                  })
                  .end((err, res) => {
                    const token = res.body.token;
                    chai
                      .request(server)
                      .get('/api/doctors/me')
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
                          'phone',
                          'specialty',
                        ]);
                        res.body.data.should.have
                          .property('name')
                          .eql(testDoctor.name);
                        res.body.data.should.have
                          .property('email')
                          .eql(testDoctor.email);
                        res.body.data.should.have
                          .property('phone')
                          .eql(testDoctor.phone);
                        res.body.data.should.have
                          .property('specialty')
                          .eql(testDoctor.specialty);
                        done();
                      });
                  });
              });
          });
      });
    });
  });
});
