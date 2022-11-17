'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Alexander',
        lastName: 'Romito',
        email: 'Pillsbury@gmail.com',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Vincent',
        lastName: 'Calfo',
        email: 'ShakeNBake@gmail.com',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Vikas',
        lastName: 'Vemuri',
        email: 'PuffNStuff@gmail.com',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Craig',
        lastName: 'Iacovino',
        email: 'Zacharia@gmail.com',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Brad',
        lastName: 'Heiple',
        email: 'Heiple@gmail.com',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Jason',
        lastName: 'Heakins',
        email: 'Heakins@gmail.com',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        firstName: 'Martin',
        lastName: 'Habich',
        email: 'Martini@gmail.com',
        username: 'FakeUser6',
        hashedPassword: bcrypt.hashSync('password6')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      firstName: { [Op.in]: ['Alexander', 'Vincent', 'Vikas', 'Craig', 'Brad', 'Jason', 'Martin'] }
    }, {});
  }
};
