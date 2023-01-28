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
  })

  afterEach(() => {
    (Teams.findAll as sinon.SinonStub).restore();
  })

  it('should return all teams', async () => {
    let chaiHttpResponse = await chai.request(app).get('/teams')

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockTeams)
  })
})