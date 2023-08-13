const chai = require('chai');
const chaiHTTP = require('chai-http');
const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');
const Record = require('../models/record.model');

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

const testPatient = {
  name: 'patient',
  email: 'patient@deal.com',
  password: '123456789',
  dateOfBirth: new Date().toISOString(),
  gender: 'male',
};
const testPatient2 = {
  name: 'patient2',
  email: 'patient2@deal.com',
  password: '123456789',
  dateOfBirth: new Date().toISOString(),
  gender: 'female',
};

const testRecord = {
  notes: 'notes',
  sessionDate: new Date().toISOString(),
  treatment: 'treatment',
};

describe('> Record Operations', () => {
  before(() => {
    return Promise.all([
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      Record.deleteMany({}),
      new Promise((resolve, reject) => {
        server.then((s) => {
          server = s;
          resolve();
        });
      }),
    ]);
  });
  afterEach(() => {
    return Promise.all([
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      Record.deleteMany({}),
    ]);
  });
  describe('> Create a record', () => {
    it('should create a record by a doctor', (done) => {
      Promise.all([
        Doctor.create(testDoctor),
        Patient.create(testPatient),
      ]).then(([doctor, patient]) => {
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
              .post('/api/records')
              .send({
                doctorId: doctor._id,
                patientId: patient._id,
                ...testRecord,
              })
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.all.keys(['status', 'data']);
                res.body.status.should.be.a('string').eql('success');
                res.body.should.have.property('data');
                res.body.data.should.include.all.keys([
                  'doctorId',
                  'patientId',
                  'notes',
                  'sessionDate',
                  'treatment',
                  'messages',
                ]);
                res.body.data.doctorId.should.be
                  .a('string')
                  .eql(doctor._id.toString());
                res.body.data.patientId.should.be
                  .a('string')
                  .eql(patient._id.toString());
                res.body.data.notes.should.be
                  .a('string')
                  .eql('notes');
                res.body.data.sessionDate.should.be.a('string');
                res.body.data.treatment.should.be
                  .a('string')
                  .eql('treatment');
                res.body.data.messages.should.be.a('array').eql([]);
                done();
              });
          });
      });
    });
    it('should not create a record with same patient and doctor twice', (done) => {
      Promise.all([
        Doctor.create(testDoctor),
        Patient.create(testPatient),
      ]).then(([doctor, patient]) => {
        Record.create({
          doctorId: doctor._id,
          patientId: patient._id,
          ...testRecord,
        }).then((record) => {
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
                .post('/api/records')
                .send({
                  doctorId: doctor._id,
                  patientId: patient._id,
                  ...testRecord,
                })
                .set('authorization', `Bearer ${token}`)
                .end((err, res) => {
                  res.should.have.status(409);
                  res.body.should.include.all.keys([
                    'status',
                    'message',
                  ]);
                  res.body.status.should.be.a('string').eql('fail');
                  res.body.message.should.be
                    .a('string')
                    .eql('Duplicate field value: doctorId');
                  done();
                });
            });
        });
      });
    });
    it('should not create a record by a patient', (done) => {
      Promise.all([
        Doctor.create(testDoctor),
        Patient.create(testPatient),
      ]).then(([doctor, patient]) => {
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
              .post('/api/records')
              .send({
                doctorId: doctor._id,
                patientId: patient._id,
                notes: 'notes',
                sessionDate: new Date().toISOString(),
                treatment: 'treatment',
              })
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(403);
                res.body.should.include.all.keys([
                  'status',
                  'message',
                ]);
                res.body.status.should.be.a('string').eql('fail');
                res.body.message.should.be
                  .a('string')
                  .eql(
                    'There is no Doctor with this token, Please login as Doctor'
                  );

                done();
              });
          });
      });
    });
    it('should not create a record if patientId is not exist', (done) => {
      Doctor.create(testDoctor).then((doctor) => {
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
              .post('/api/records')
              .send({
                doctorId: doctor._id,
                patientId: '123456789012',
                notes: 'notes',
                sessionDate: new Date().toISOString(),
                treatment: 'treatment',
              })
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.include.all.keys([
                  'status',
                  'message',
                ]);
                res.body.status.should.be.a('string').eql('fail');
                res.body.message.should.be
                  .a('string')
                  .eql('Patient not found');
                done();
              });
          });
      });
    });
  });
  describe('> Get all owned patients of doctor', () => {
    it('should get all owned patients of doctor', (done) => {
      Promise.all([
        Doctor.create(testDoctor),
        Patient.create(testPatient),
      ]).then(([doctor, patient]) => {
        Record.create({
          doctorId: doctor._id,
          patientId: patient._id,
          ...testRecord,
        }).then((record) => {
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
                .get('/api/records/owned')
                .set('authorization', `Bearer ${token}`)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.all.keys([
                    'status',
                    'data',
                    'length',
                  ]);
                  res.body.status.should.be
                    .a('string')
                    .eql('success');
                  res.body.should.have.property('data');
                  res.body.data.should.be.a('array');
                  res.body.data[0].should.include.all.keys([
                    'doctorId',
                    'patientId',
                    'notes',
                    'sessionDate',
                    'treatment',
                    'messages',
                  ]);
                  res.body.data[0].patientId.should.include.all.keys([
                    'name',
                    'email',
                    'dateOfBirth',
                    'gender',
                  ]);
                  res.body.data[0].patientId.should.have
                    .property('name')
                    .eql(testPatient.name);
                  res.body.data[0].patientId.should.have
                    .property('email')
                    .eql(testPatient.email);
                  res.body.data[0].patientId.should.have
                    .property('dateOfBirth')
                    .eql(testPatient.dateOfBirth);
                  done();
                });
            });
        });
      });
    });
    it('should get empty owned patients of doctor', (done) => {
      Doctor.create(testDoctor).then((doctor) => {
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
              .get('/api/records/owned')
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.all.keys([
                  'status',
                  'data',
                  'length',
                ]);
                res.body.status.should.be.a('string').eql('success');
                res.body.should.have.property('data');
                res.body.data.should.be.a('array').eql([]);
                done();
              });
          });
      });
    });
  });
  describe('> Get one owned patient of doctor', () => {
    it('should get one owned patient of doctor', (done) => {
      Promise.all([
        Doctor.create(testDoctor),
        Patient.create(testPatient),
      ]).then(([doctor, patient]) => {
        Record.create({
          doctorId: doctor._id,
          patientId: patient._id,
          ...testRecord,
        }).then((record) => {
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
                .get(`/api/records/owned/${patient._id}`)
                .set('authorization', `Bearer ${token}`)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.all.keys(['status', 'data']);
                  res.body.status.should.be
                    .a('string')
                    .eql('success');
                  res.body.should.have.property('data');
                  res.body.data.should.include.all.keys([
                    'doctorId',
                    'patientId',
                    'notes',
                    'sessionDate',
                    'treatment',
                    'messages',
                  ]);
                  res.body.data.patientId.should.include.all.keys([
                    'name',
                    'email',
                    'dateOfBirth',
                    'gender',
                  ]);
                  res.body.data.patientId.should.have
                    .property('name')
                    .eql(testPatient.name);
                  res.body.data.patientId.should.have
                    .property('email')
                    .eql(testPatient.email);
                  res.body.data.patientId.should.have
                    .property('dateOfBirth')
                    .eql(testPatient.dateOfBirth);
                  done();
                });
            });
        });
      });
    });
    it('should not get one owned patient of doctor if patientId is not exist', (done) => {
      Doctor.create(testDoctor).then((doctor) => {
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
              .get('/api/records/owned/123456789012')
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.include.all.keys([
                  'status',
                  'message',
                ]);
                res.body.status.should.be.a('string').eql('fail');
                res.body.message.should.be
                  .a('string')
                  .eql(
                    'There is no record between this doctor and this patient'
                  );
                done();
              });
          });
      });
    });
  });
  describe('> Update one owned patient of doctor', () => {
    it('should update one owned patient of doctor', (done) => {
      Promise.all([
        Doctor.create(testDoctor),
        Patient.create(testPatient),
      ]).then(([doctor, patient]) => {
        Record.create({
          doctorId: doctor._id,
          patientId: patient._id,
          ...testRecord,
        }).then((record) => {
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
                .patch(`/api/records/owned/${patient._id}`)
                .send({
                  notes: 'new notes',
                })
                .set('authorization', `Bearer ${token}`)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.all.keys(['status', 'data']);
                  res.body.status.should.be
                    .a('string')
                    .eql('success');
                  res.body.should.have.property('data');
                  res.body.data.should.include.all.keys([
                    'doctorId',
                    'patientId',
                    'notes',
                    'sessionDate',
                    'treatment',
                    'messages',
                  ]);
                  res.body.data.notes.should.be
                    .a('string')
                    .eql('new notes');
                  res.body.data.sessionDate.should.be.a('string');
                  res.body.data.treatment.should.be
                    .a('string')
                    .eql(testRecord.treatment);
                  done();
                });
            });
        });
      });
    });
    it('should not update one owned patient of doctor if patientId is not exist', (done) => {
      Doctor.create(testDoctor).then((doctor) => {
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
              .patch('/api/records/owned/123456789012')
              .send({
                notes: 'new notes',
              })
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.include.all.keys([
                  'status',
                  'message',
                ]);
                res.body.status.should.be.a('string').eql('fail');
                res.body.message.should.be
                  .a('string')
                  .eql(
                    'There is no record between this doctor and this patient'
                  );
                done();
              });
          });
      });
    });
  });
  describe('> Send message to all owned patients of doctor', () => {
    it('should send message to all owned patients of doctor', (done) => {
      Promise.all([
        Doctor.create(testDoctor),
        Patient.create(testPatient),
        Patient.create(testPatient2),
      ]).then(([doctor, patient, patient2]) => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
            password: testDoctor.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            Promise.all([
              Record.create({
                doctorId: doctor._id,
                patientId: patient._id,
                ...testRecord,
              }),
              Record.create({
                doctorId: doctor._id,
                patientId: patient2._id,
                ...testRecord,
              }),
            ]).then(([record1, record2]) => {
              chai
                .request(server)
                .patch(`/api/records/owned/send-message`)
                .send({
                  message: 'new message',
                })
                .set('authorization', `Bearer ${token}`)
                .end((err, res) => {
                  res.should.have.status(204);
                  chai
                    .request(server)
                    .get('/api/records/owned')
                    .set('authorization', `Bearer ${token}`)
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.have.all.keys([
                        'status',
                        'data',
                        'length',
                      ]);
                      res.body.status.should.be
                        .a('string')
                        .eql('success');
                      res.body.should.have.property('data');
                      res.body.data.should.be.a('array');
                      for (let i = 0; i < res.body.data; ++i) {
                        res.body.data[i].should.have.property(
                          'messages'
                        );
                        res.body.data[i].messages.should.be.a(
                          'array'
                        );
                        res.body.data[
                          i
                        ].messages[0].should.include.all.keys([
                          'message',
                          'date',
                        ]);
                        res.body.data[i].messages[0].message.should.be
                          .a('string')
                          .eql('new message');
                      }

                      done();
                    });
                });
            });
          });
      });
    });
    it('should not send message to all owned patients of doctor if doctor has no patients', (done) => {
      Doctor.create(testDoctor).then((doctor) => {
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
              .patch(`/api/records/owned/send-message`)
              .send({
                message: 'new message',
              })
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.include.all.keys([
                  'status',
                  'message',
                ]);
                res.body.status.should.be.a('string').eql('fail');
                res.body.message.should.be
                  .a('string')
                  .eql('You have noy any patients to send message to');
                done();
              });
          });
      });
    }); `      `
  });
  describe('> Send message to one owned patient of doctor', () => {
    it('should send message to one owned patient of doctor', (done) => {
      Promise.all([
        Doctor.create(testDoctor),
        Patient.create(testPatient),
      ]).then(([doctor, patient]) => {
        chai
          .request(server)
          .post('/api/doctors/login')
          .send({
            email: testDoctor.email,
            password: testDoctor.password,
          })
          .end((err, res) => {
            const token = res.body.token;
            Record.create({
              doctorId: doctor._id,
              patientId: patient._id,
              ...testRecord,
            }).then((record) => {
              chai
                .request(server)
                .patch(
                  `/api/records/owned/send-message/${patient._id}`
                )
                .send({
                  message: 'new message',
                })
                .set('authorization', `Bearer ${token}`)
                .end((err, res) => {
                  res.should.have.status(204);
                  chai
                    .request(server)
                    .get(`/api/records/owned/${patient._id}`)
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
                      res.body.should.have.property('data');
                      res.body.data.should.have.property('messages');
                      res.body.data.messages.should.be.a('array');
                      res.body.data.messages[0].should.include.all.keys(
                        ['message', 'date']
                      );
                      res.body.data.messages[0].message.should.be
                        .a('string')
                        .eql('new message');
                      done();
                    });
                });
            });
          });
      });
    });
    it('should not send message to one owned patient of doctor if patientId is not exist', (done) => {
      Doctor.create(testDoctor).then((doctor) => {
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
              .patch('/api/records/owned/send-message/123456789012')
              .send({
                message: 'new message',
              })
              .set('authorization', `Bearer ${token}`)
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.include.all.keys([
                  'status',
                  'message',
                ]);
                res.body.status.should.be.a('string').eql('fail');
                res.body.message.should.be
                  .a('string')
                  .eql(
                    'There is no record between this doctor and this patient'
                  );
                done();
              });
          });
      });
    });
  });
});
