import { Model, INTEGER, BOOLEAN } from 'sequelize';
import Teams from './Teams';
import db from '.';

class Matches extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare awayTeamId: number;

  declare homeTeamGoals: number;
  declare awayTeamGoals: number;

  declare inProgress: boolean;
}

Matches.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  homeTeamId: {
    type: INTEGER,
    field: 'home_team_id',
    allowNull: false,
    references: { model: 'teams', key: 'id' },

  },
  homeTeamGoals: {
    type: INTEGER,
    field: 'home_team_goals',
    allowNull: false,
  },
  awayTeamId: {
    type: INTEGER,
    field: 'away_team_id',
    references: { model: 'teams', key: 'id' },
  },

  awayTeamGoals: {
    type: INTEGER,
    field: 'away_team_goals',
    allowNull: false,
  },

  inProgress: {
    type: BOOLEAN,
    field: 'in_progress',
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

Teams.belongsTo(Matches, { foreignKey: 'id', as: 'homeTeamId' });
Teams.belongsTo(Matches, { foreignKey: 'id', as: 'awayTeamId' });

Matches.hasMany(Teams, { foreignKey: 'homeTeamId', as: 'id' });
Matches.hasMany(Teams, { foreignKey: 'awayTeamId', as: 'id' });

export default Matches;
