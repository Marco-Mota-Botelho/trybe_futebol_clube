import { Response, Request } from 'express';
import TeamsService from '../services/teams.service';

export default class TeamController {
  constructor(private teamService: TeamsService = new TeamsService()) {}

  public getAllTeams = async (
    _req: Request,
    res: Response,
  ) => {
    try {
      console.log(this);
      const teamsData = await this.teamService.getAll();

      return res.status(teamsData.status).json(teamsData.teams);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Unexpected Error' });
    }
  };
}
