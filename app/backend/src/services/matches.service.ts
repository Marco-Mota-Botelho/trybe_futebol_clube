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
}
