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
     return queryInterface.bulkInsert('Attendances', [
      {
        eventId: 1,
        userId: 1,
        status: "member"
      },
      {
        eventId: 2,
        userId: 3,
        status: "waitlist"
      },
      {
        eventId: 1,
        userId: 2,
        status: "member"
      },
      {
        eventId: 2,
        userId: 4,
        status: "pending"
      },

    ], {});
  },
  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Attendances', {}, {});
  }
};
