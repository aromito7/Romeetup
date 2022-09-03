'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Venues', [
      {
        groupId: 1,
        address: "a/A Discord",
        city: "Discord",
        state: "The Internet",
        lat: 420.69,
        lng: 69.420
      },
      {
        groupId: 3,
        address: "Arsenal Tennis Courts",
        city: "Pittsburgh",
        state: "PA",
        lat: 40.4664,
        lng: 79.9609
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Venues', {
      address: { [Op.in]: ["a/A Discord", "Arsenal Tennis Courts"] }
    }, {});
  }
};
