'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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
    options.tableName = 'Attendances'
     return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 1,
        status: "member"
      },
      {
        eventId: 2,
        userId: 3,
        status: "member"
      },
      {
        eventId: 1,
        userId: 2,
        status: "waitlist"
      },
      {
        eventId: 2,
        userId: 4,
        status: "pending"
      },
      {
        eventId: 1,
        userId: 3,
        status: "pending"
      }

    ], {});
  },
  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    options.tableName = "Attendances"
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete('Attendances', {}, {});
  }
};
