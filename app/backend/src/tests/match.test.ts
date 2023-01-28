import * as sinon from 'sinon';
import * as chai from 'chai';
import Match from '../database/models/Match';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

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

describe('Matches', () => {
  beforeEach(() => {
    const stub = sinon.stub(Match, "findAll")
      
    stub.withArgs(sinon.match.hasNested('where.inProgress', true))
    .resolves([mockMatches[1]] as unknown as Match[]);

    stub.withArgs(sinon.match.hasNested('where.inProgress', false))
    .resolves([mockMatches[0]] as unknown as Match[]);

    stub.resolves(mockMatches as unknown as Match[]);
  });
  
  afterEach(() => {
    (Match.findAll as sinon.SinonStub).restore();
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
  })

  it('should show matches not in progress', async () => {
    let chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal([mockMatches[0]]);
  })

})