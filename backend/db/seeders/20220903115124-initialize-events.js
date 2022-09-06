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
     return queryInterface.bulkInsert('Events', [
      {
        venueId: 1,
        groupId: 1,
        name: "Practice Exam Walkthrough",
        description: "Where we go over the practice exam and ask questions to prepare for the assessment.",
        type: "Online",
        capacity: 10,
        price: 10,
        startDate:   new Date(Date.now("2022-09-23")).toISOString(),
        endDate: new Date(Date.now("2022-09-25")).toISOString()
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Tennis Tournament",
        description: "Annual tournament held at the end of each summer for all players.",
        type: "In person",
        capacity: 100,
        price: 15,
        startDate:  new Date(Date.now("2022-09-30")).toISOString(),
        endDate: new Date(Date.now("2022-10-03")).toISOString()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Events', {
      name: { [Op.in]: ["Practice Exam Walkthrough", "Tennis Tournament"] }
    }, {});
  }
};
