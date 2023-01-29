import MatchInterface from '../interfaces/match.interface';
import Match from '../database/models/Match';

const HTTP_STATUS_OK = 200;
// const HTTP_STATUS_NOT_FOUND = 404;

export default class MatchService {
  constructor(private matchModel = Match) {}

  public async getAll(filters: { inProgress?: boolean }) {
    if (filters.inProgress === undefined) {
      const matches = await this.matchModel.findAll({ include: [
        { association: 'homeTeam', attributes: ['teamName'] },
        { association: 'awayTeam', attributes: ['teamName'] }] });

      return { status: HTTP_STATUS_OK, matches };
    }
    const matches = await this.matchModel.findAll({ where: filters,
      include: [
        { association: 'homeTeam', attributes: ['teamName'] },
        { association: 'awayTeam', attributes: ['teamName'] }] });

    return { status: HTTP_STATUS_OK, matches };
  }

  public async addMatch(match: MatchInterface) {
    const newMatch = await this.matchModel.create({ ...match, inProgress: true });

    return newMatch;
  }

  public async finishMatch(id: number) {
    const matchToFinish = await this.matchModel.findOne({ where: { id } });

    if (matchToFinish) {
      matchToFinish.inProgress = false;

      await matchToFinish?.save();

      return { status: 200 };
    }

    return { status: 400 };
  }

  public async updateMatch(
    id: number,
    scores: { homeTeamGoals: number, awayTeamGoals: number },
  ) {
    const matchToUpdate = await this.matchModel.findOne({ where: { id } });

    if (!matchToUpdate) return { status: 404, message: 'match not found' };

    matchToUpdate.set({
      homeTeamGoals: scores.homeTeamGoals,
      awayTeamGoals: scores.awayTeamGoals,
    });

    matchToUpdate.save();

    return { status: 200, message: 'Updated' };
  }
}
