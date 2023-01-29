import { NextFunction, Request, Response } from 'express';
import TeamsService from '../services/teams.service';

const teamService = new TeamsService();

export function validateTeams(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { homeTeamId, awayTeamId } = req.body;

  if (homeTeamId === awayTeamId) {
    return res.status(422).json({
      message: 'It is not possible to create a match with two equal teams' });
  }

  next();
}

export async function validateTeam(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { homeTeamId, awayTeamId } = req.body;
  const homeTeam = await teamService.getById(parseInt(homeTeamId, 10));
  const awayTeam = await teamService.getById(parseInt(awayTeamId, 10));
  if (awayTeam.status === 404 || homeTeam.status === 404) {
    return res.status(404).json({ message: 'There is no team with such id!' });
  }
  next();
}
