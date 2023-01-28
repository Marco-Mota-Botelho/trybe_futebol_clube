import * as sinon from 'sinon';
import * as chai from 'chai';
import Users from '../database/models/Users';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const mockUser = {
  email: 'user@user.com',
  password: 'secret_user'
}

describe('Login', () => {
  beforeEach(async () => {
    sinon
      .stub(Users, "findOne")
      .resolves({
        id: 2,
        username: 'User',
        email: 'user@user.com',
        password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
        role:'user'
        // password: secret_user
      }as Users)
  })

  afterEach(() => {
    (Users.findOne as sinon.SinonStub).restore();
  });

  it('can login', async () => {
    let chaiHttpResponse = await chai.request(app).post('/login').send(mockUser)

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.have.property('token');

    const token = chaiHttpResponse.body.token;

    chaiHttpResponse = await chai.request(app).get('/login/validate').set('authorization', token);

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.have.property('role', 'user');
  });
  it("rejects wrong password", async () => {
    let chaiHttpResponse = await chai.request(app).post('/login').send({ email: mockUser.email, password: "batata"});

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.have.property('message', 'Incorrect email or password');
  });
})