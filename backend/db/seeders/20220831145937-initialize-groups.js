'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Groups', [
      {
        name: 'Homework Squad',
        about: 'a/A June 2022 Cohort',
        type: 'educational',
        private: true
      },
      {
        name: 'Tennis Group',
        about: 'Local Tennis Players',
        type: 'athletic',
        private: false,
        city: 'Pittsburgh',
        state: "PA"
      },
      {
        name: 'Cross Country Team',
        about: 'Highschool Team',
        type: 'athletic',
        private: false,
        city: 'Murrysville',
        state: "PA"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Groups', {
      name: { [Op.in]: ['Homeworkd Squad', 'Tennis Group', 'Cross Country Team'] }
    }, {});
  }
};
