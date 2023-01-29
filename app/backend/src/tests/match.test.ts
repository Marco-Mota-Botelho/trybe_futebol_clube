import * as sinon from 'sinon';
import * as chai from 'chai';
import Match from '../database/models/Match';
import Users from '../database/models/Users';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const mockMatches = [
  {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 1,
    "awayTeamId": 8,
    "awayTeamGoals": 1,
    "inProgress": false,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Grêmio"
    }
  },
  {
    "id": 41,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 9,
    "awayTeamGoals": 0,
    "inProgress": true,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Internacional"
    }
  }
]

const mockUser = {
  email: 'user@user.com',
  password: 'secret_user'
}

const mockMatchToAdd = {
  homeTeamId: 16,
  awayTeamId: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
}

const mockCreatedMatch = {
  id: 1,
  homeTeamId: 16,
  homeTeamGoals: 2,
  awayTeamId: 8,
  awayTeamGoals: 2,
  inProgress: true,
}
describe('Matches', () => {
  beforeEach(() => {
    const stub = sinon.stub(Match, "findAll")
      
    stub.withArgs(sinon.match.hasNested('where.inProgress', true))
    .resolves([mockMatches[1]] as unknown as Match[]);

    stub.withArgs(sinon.match.hasNested('where.inProgress', false))
    .resolves([mockMatches[0]] as unknown as Match[]);

    stub.resolves(mockMatches as unknown as Match[]);

    sinon
      .stub(Match,"findOne")
      .resolves(mockCreatedMatch as Match)

    sinon
      .stub(Match, "create")
      .resolves({
        id: 1,
        homeTeamId: 16,
        homeTeamGoals: 2,
        awayTeamId: 8,
        awayTeamGoals: 2,
        inProgress: true,
      }as Match)

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
  });
  
  afterEach(() => {
    (Match.findAll as sinon.SinonStub).restore();
    (Match.create as sinon.SinonStub).restore();
    (Match.findOne as sinon.SinonStub).restore();
    (Users.findOne as sinon.SinonStub).restore();
  })

  it('should show all matches', async () => {
    let chaiHttpResponse = await chai.request(app).get('/matches');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockMatches);
  });

  it('should show matches in progress', async () => {
    let chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal([mockMatches[1]]);
  });

  it('should show matches not in progress', async () => {
    let chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal([mockMatches[0]]);
  });

  it('should create a new match in progress', async () => {
    let chaiHttpResponse = await chai.request(app).post('/login').send(mockUser);

    const token = chaiHttpResponse.body.token;
    
    chaiHttpResponse = await chai.request(app).post('/matches').set('authorization', token).send(mockMatchToAdd);

    expect(chaiHttpResponse).to.have.status(201);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockCreatedMatch);
  });

  it('should not create a new match', async () => {
    let chaiHttpResponse = await chai.request(app).post('/matches').send(mockMatchToAdd);

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.have.property('message', 'Token not found');

    chaiHttpResponse = await chai.request(app).post('/login').send(mockUser);

    const token = chaiHttpResponse.body.token;
    
    chaiHttpResponse = await chai.request(app).post('/matches').set('authorization', token).send({
      homeTeamId: 8,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    });

    expect(chaiHttpResponse).to.have.status(422);
    expect(chaiHttpResponse.body).to.have.property('message', 'It is not possible to create a match with two equal teams');

    chaiHttpResponse = await chai.request(app).post('/matches').set('authorization', token).send({
      homeTeamId: 841,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    });

    expect(chaiHttpResponse).to.have.status(404);
    expect(chaiHttpResponse.body).to.have.property('message', 'There is no team with such id!');
  });

  // it('should save the match progress', async () => {
  //   let chaiHttpResponse = await chai.request(app).post('/login').send(mockUser);

  //   const token = chaiHttpResponse.body.token;
    
  //   chaiHttpResponse = await chai.request(app).patch('/matches/1/finish').set('authorization', token)

  //   expect(chaiHttpResponse).to.have.status(200)
  //   expect(chaiHttpResponse.body).to.have.property('message', 'Finished');
  // });

})