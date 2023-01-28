import { Request, Response } from 'express';
import MatchService from '../services/matches.service';

export default class MatchController {
  constructor(private matchService: MatchService = new MatchService()) {}

  public getAll = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const matchesData = await this.matchService.getAll();

      return res.status(matchesData.status).json(matchesData.matches);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'unexpected error' });
    }
  };
}