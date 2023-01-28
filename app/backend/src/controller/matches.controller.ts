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
      console.log(error);
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
      if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = verifyToken(authorization);
      console.log({ user });
      if (user) {
        const newMatch = await this.matchService.addMatch(match);
        return res.status(201).json(newMatch);
      }
    } catch (error) {
      return res.status(500).json({ message: 'unexpected error' });
    }
  };
}
