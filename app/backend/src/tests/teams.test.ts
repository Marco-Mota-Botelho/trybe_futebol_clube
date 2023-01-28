import * as sinon from 'sinon';
import * as chai from 'chai';
import Teams from '../database/models/Teams';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const mockTeams = [
  {
    id: 1,
    teamName: "Avaí/Kindermann"
  },
  {
    id: 2,
    teamName: "Bahia"
  },
  {
    id: 3,
    teamName: "Botafogo"
  },
]

describe('Teams', () => {
  beforeEach( () => {
    sinon
      .stub(Teams, "findAll")
      .resolves(
        [
          {
            id: 1,
            teamName: "Avaí/Kindermann"
          },
          {
            id: 2,
            teamName: "Bahia"
          },
          {
            id: 3,
            teamName: "Botafogo"
          },
        ] as Teams[])
  
    const stub = sinon.stub(Teams, "findByPk");

    stub
      .withArgs(2)
      .resolves({
        id: 2,
        teamName: "Bahia"
      } as Teams)

    stub
      .withArgs(4)
      .resolves(null);
  })

  afterEach(() => {
    (Teams.findAll as sinon.SinonStub).restore();
    (Teams.findByPk as sinon.SinonStub).restore();
  })

  it('should return all teams', async () => {
    let chaiHttpResponse = await chai.request(app).get('/teams')

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockTeams)
  })

  it('should return specific team', async () => {
    let chaiHttpResponse = await chai.request(app).get('/teams/2');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockTeams[1]);
  })

  it('should fail when requesting unexisting id', async () => {
    let chaiHttpResponse = await chai.request(app).get('/teams/4');

    expect(chaiHttpResponse).to.have.status(404);
  })
})