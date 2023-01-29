import { Request, Response } from 'express';
import verifyToken from '../auth/verifyToken';
import MatchService from '../services/matches.service';

export default class MatchController {
  constructor(private matchService: MatchService = new MatchService()) {}

  public getAll = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { inProgress } = req.query;
      const matchesData = await this.matchService.getAll({
        inProgress: inProgress === undefined ? undefined : inProgress === 'true',
      });

      return res.status(matchesData.status).json(matchesData.matches);
    } catch (error) {
      return res.status(500).json({ message: 'unexpected error' });
    }
  };

  public createMatch = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const match = req.body;
      const authorization = req.header('authorization');
      const user = verifyToken(authorization!);
      console.log({ user });
      if (user) {
        const newMatch = await this.matchService.addMatch(match);
        return res.status(201).json(newMatch);
      }
    } catch (error) {
      return res.status(500).json({ message: 'unexpected error' });
    }
  };

  public finishMatch = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const match = await this.matchService.finishMatch(parseInt(id, 10));

      return res.status(match.status).json({ message: 'Finished' });
    } catch (error) {
      return res.status(500).json({ message: 'Unexpected Error' });
    }
  };

  public updateMatch = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const scores = req.body;

      console.log({ scores });

      const response = await this.matchService.updateMatch(parseInt(id, 10), scores);

      return res.status(response.status).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Unexpected Error' });
    }
  };
}
