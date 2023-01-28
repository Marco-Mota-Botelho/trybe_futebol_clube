import { Response, Request } from 'express';
import TeamsService from '../services/teams.service';

export default class TeamController {
  constructor(private teamService: TeamsService = new TeamsService()) {}

  public getAllTeams = async (
    _req: Request,
    res: Response,
  ) => {
    try {
      const teamsData = await this.teamService.getAll();

      return res.status(teamsData.status).json(teamsData.teams);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Unexpected Error' });
    }
  };

  public getTeamById = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const teamData = await this.teamService.getById(parseInt(id, 10));

      return res.status(teamData.status).json(teamData.team ?? teamData.message);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Unexpected Error' });
    }
  };
}
