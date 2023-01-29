import { Request, Response } from 'express';
import Match from '../database/models/Match';
import MatchService from '../services/matches.service';
import TeamsService from '../services/teams.service';

export default class LeaderboardController {
  constructor(
    private matchService: MatchService = new MatchService(),
    private teamService: TeamsService = new TeamsService(),
  ) {
  }

  private getAllMatches = async () => {
    const matches = await this.matchService.getAll({ inProgress: false });

    return matches;
  };

  private calculateAwayPoints = async (matches: Match[]) => {
    const stats = {
      pointsAway: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
    };

    matches.forEach((game) => {
      if (game.awayTeamGoals > game.homeTeamGoals) {
        stats.pointsAway += 3;
        stats.totalVictories += 1;
      } else if (game.awayTeamGoals < game.homeTeamGoals) {
        stats.totalLosses += 1;
      } else {
        stats.pointsAway += 1;
        stats.totalDraws += 1;
      }
    });

    return stats;
  };

  private calculateHomePoints = async (matches: Match[]) => {
    const stats = {
      pointsHome: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
    };

    matches.forEach((game) => {
      if (game.awayTeamGoals < game.homeTeamGoals) {
        stats.pointsHome += 3;
        stats.totalVictories += 1;
      } else if (game.awayTeamGoals > game.homeTeamGoals) {
        stats.totalLosses += 1;
      } else {
        stats.pointsHome += 1;
        stats.totalDraws += 1;
      }
    });

    return stats;
  };

  private calculatePoints = async (teamId: number) => {
    const teamMatches = await this.getTeamMatches(teamId);
    const gamesAway = teamMatches.filter((match) => match.awayTeamId === teamId);
    const gamesHome = teamMatches.filter((match) => match.homeTeamId === teamId);
    const statsAway = await this.calculateAwayPoints(gamesAway);
    const statsHome = await this.calculateHomePoints(gamesHome);

    const finalStats = {
      totalPoints: statsHome.pointsHome + statsAway.pointsAway,
      totalVictories: statsHome.totalVictories + statsAway.totalVictories,
      totalDraws: statsHome.totalDraws + statsAway.totalDraws,
      totalLosses: statsHome.totalLosses + statsAway.totalLosses,
    };

    return finalStats;
  };

  private calculateGoals = async (teamId: number) => {
    const teamMatches = await this.getTeamMatches(teamId);
    const gamesAway = teamMatches.filter((match) => match.awayTeamId === teamId);
    const gamesHome = teamMatches.filter((match) => match.homeTeamId === teamId);
    let goalsFavor = 0.0;
    let goalsOwn = 0;
    gamesAway.forEach((game) => {
      goalsFavor += game.awayTeamGoals;
      goalsOwn += game.homeTeamGoals;
    });

    gamesHome.forEach((game) => {
      goalsFavor += game.homeTeamGoals;
      goalsOwn += game.awayTeamGoals;
    });

    return { goalsFavor, goalsOwn, goalsBalance: goalsFavor - goalsOwn };
  };

  private calculateGoalsHome = async (teamId: number) => {
    const teamMatches = await this.getTeamMatches(teamId);
    const gamesHome = teamMatches.filter((match) => match.homeTeamId === teamId);
    let goalsFavor = 0.0;
    let goalsOwn = 0;

    gamesHome.forEach((game) => {
      goalsFavor += game.homeTeamGoals;
      goalsOwn += game.awayTeamGoals;
    });

    return { goalsFavor, goalsOwn, goalsBalance: goalsFavor - goalsOwn };
  };

  private generateTeamData = async (teamId:number) => {
    const { team } = await this.teamService.getById(teamId);

    const stats = await this.calculatePoints(teamId);
    const { goalsBalance, goalsFavor, goalsOwn } = await this.calculateGoals(teamId);
    const totalGames = (await this.getTeamMatches(teamId)).length;
    const efficiency = (100 * stats.totalPoints) / (totalGames * 3);

    return {
      name: team?.teamName,
      totalPoints: stats.totalPoints,
      totalGames,
      totalVictories: stats.totalVictories,
      totalDraws: stats.totalDraws,
      totalLosses: stats.totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  };

  private generateTeamDataHome = async (teamId:number) => {
    const { team } = await this.teamService.getById(teamId);
    const matches = await this.getTeamMatches(teamId);
    const homeMatches = matches.filter((match) => match.homeTeamId === teamId);
    const stats = await this.calculateHomePoints(homeMatches);
    const { goalsBalance, goalsFavor, goalsOwn } = await this.calculateGoalsHome(teamId);
    const totalGames = homeMatches.length;
    const efficiency = (100 * stats.pointsHome) / (totalGames * 3);

    return { name: team?.teamName,
      totalPoints: stats.pointsHome,
      totalGames,
      totalVictories: stats.totalVictories,
      totalDraws: stats.totalDraws,
      totalLosses: stats.totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  };

  public getLeaderboards = async (
    _req: Request,
    res: Response,
  ) => {
    try {
      const { teams } = await this.teamService.getAll();
      const leaderBoard = await Promise.all(teams.map((team) => this.generateTeamData(team.id)));
      leaderBoard.sort((teamA, teamB) => teamB.totalPoints - teamA.totalPoints);
      return res.status(200).json(leaderBoard);
    } catch (error) {
      return res.status(500).json({ message: 'Unexpected Error' });
    }
  };

  public getLeaderboardsHome = async (
    _req: Request,
    res: Response,
  ) => {
    try {
      const { teams } = await this.teamService.getAll();
      const leaderBoard = await Promise.all(
        teams.map((team) => this.generateTeamDataHome(team.id)),
      );
      leaderBoard.sort((teamA, teamB) => (teamB.totalPoints - teamA.totalPoints
        || teamB.totalVictories - teamA.totalVictories
        || teamB.goalsBalance - teamA.goalsBalance
        || teamB.goalsFavor - teamA.goalsFavor
        || teamA.goalsOwn - teamB.goalsOwn));

      console.log({ leaderBoard });

      return res.status(200).json(leaderBoard);
    } catch (error) {
      return res.status(500).json({ message: 'Unexpected Error' });
    }
  };

  private getTeamMatches = async (teamId: number) => {
    const response = await this.getAllMatches();

    const teamMatches = response.matches.filter((match) =>
      (match.homeTeamId === teamId || match.awayTeamId === teamId));

    return teamMatches;
  };
}
