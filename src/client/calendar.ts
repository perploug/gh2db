import { Base } from './base';
const Sequelize = require('sequelize');
const helper = require('./helper.js');

export class Calendar extends Base {
  name = 'Calendar';
  schema = {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    date: Sequelize.DATE,
  };

  async getAll(year = 2014) {
    const date = new Date(year, 0, 1);
    const end = new Date().getFullYear();
    const months: Array<{ date: Date }> = [];

    while (date.getFullYear() <= end) {
      months.push({ date: new Date(date.valueOf()) });
      date.setMonth(date.getMonth() + 1);
    }

    return months;
  }
}
