'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {     id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
  },
  home_team_id: {
    type: Sequelize.INTEGER,
    field: "home_team_id",
    allowNull: false,
    references: { model: "teams", key: "id"},
    onUpdate: "CASCADE",
    onDelete: "CASCADE",

  },
  home_team_goals: {
    type: Sequelize.INTEGER,
    field: "home_team_goals",
    allowNull: false,
  },
  away_team_id: {
    type: Sequelize.INTEGER,
    field: "away_team_id",
    allowNull: false,
    references: {model: "teams", key: "id"},
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },

  away_team_goals: {
    type: Sequelize.INTEGER,
    field: "away_team_goals",
    allowNull: false
  },

  in_progress: {
    type: Sequelize.BOOLEAN,
    field: "in_progress",
    allowNull: false
  },
}, {
  underscored: true,
  });
},


  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('matches');
    }
};
