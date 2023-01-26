import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';

class Users extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare role:string;
  declare password: string;
}

Users.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  username: {
    type: STRING,
  },
  email: {
    type: STRING,
    unique: true,
  },
  role: {
    type: STRING,
  },
  password: {
    allowNull: false,
    type: STRING,
  },
}, {

  underscored: true,
  sequelize: db,
  modelName: 'users',
  timestamps: false,
});

export default Users;
