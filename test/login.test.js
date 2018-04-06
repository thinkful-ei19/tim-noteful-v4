'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { JWT_SECRET} = require('../config');
const { JWT_SECRET, TEST_MONGODB_URI } = require('../config');

const User = require('../models/user');
const seedUsers = require('../db/seed/users');

const expect = chai.expect;

chai.use(chaiHttp);

// let token;
// const fullname = 'Example User';
// const username = 'exampleUser';
// const password = 'examplePass';


describe('Noteful API - Login', function () {
  //   let token;

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    // const testUser = seedUsers[0];
    return User.insertMany(seedUsers);
  });

  afterEach(function () {
    // return User.remove();
    // alternatively you can drop the DB
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('/api/login', function () {
    describe('POST', function () {
      it('Should return a valid auth token', function () {
        return chai.request(app)
          .post('/api/login')
          .send({ username: 'user0', password: 'password' })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.authToken).to.be.a('string');

            const payload = jwt.verify(res.body.authToken, JWT_SECRET);

            expect(payload.user).to.not.have.property('password');
            expect(payload.user).to.deep.equal({ id: '333333333333333333333300', username: 'user0', fullname: 'User Zero' });
          });
      });



    });
  });
});