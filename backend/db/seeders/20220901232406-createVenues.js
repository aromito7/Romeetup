'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     return queryInterface.bulkInsert('Venues', [
      {
        address: "a/A Discord",
        city: "Discord",
        state: "The Internet",
        lat: 420.69,
        lng: 69.420
      },
      {
        address: "Arsenal Tennis Courts",
        city: "Pittsburgh",
        state: "PA",
        lat: 40.4664,
        lng: 79.9609
      }
     ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete('Venues', {
       id: { [Op.in]: [...Array(3).keys()].map(key => key + 1) }
     }, {});
  }
};
