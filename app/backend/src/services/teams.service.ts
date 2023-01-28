import Teams from '../database/models/Teams';

const HTTP_STATUS_OK = 200;

export default class TeamsService {
  constructor(private teamModel = Teams) {}
  public async getAll() {
    const teams = await this.teamModel.findAll();

    return { status: HTTP_STATUS_OK,
      teams,
    };
  }
}
