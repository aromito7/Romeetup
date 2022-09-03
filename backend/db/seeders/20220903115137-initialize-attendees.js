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
     return queryInterface.bulkInsert('Attendees', [
      {
        eventId: 1,
        userId: 1,
        status: "Attending"
      },
      {
        eventId: 2,
        userId: 3,
        status: "Not Attending"
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Attendees', {}, {});
  }
};
