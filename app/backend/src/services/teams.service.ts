import Teams from '../database/models/Teams';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;

export default class TeamsService {
  constructor(private teamModel = Teams) {}
  public async getAll() {
    const teams = await this.teamModel.findAll();

    return { status: HTTP_STATUS_OK,
      teams,
    };
  }

  public async getById(id:number) {
    const team = await this.teamModel.findByPk(id);

    if (!team) return { status: HTTP_STATUS_NOT_FOUND, message: 'Team not found' };

    return { status: HTTP_STATUS_OK, team };
  }
}
