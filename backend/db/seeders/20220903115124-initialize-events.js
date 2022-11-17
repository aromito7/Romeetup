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
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Pittsburgh Marathon",
        description: "The 27th annual Pittsburgh Marathon",
        type: "In person",
        capacity: 1000,
        price: 80,
        startDate: new Date(Date.now("2023-05-03")).toISOString(),
        endDate: new Date(Date.now("2022-05-05")).toISOString()
      },
      {
        venueId: 4,
        groupId: 4,
        name: "Grad Prix Pittsburgh",
        description: "A large tournament for Magic: The Gathering",
        type: "In person",
        capacity: 5000,
        price: 60,
        startDate: new Date(Date.now("2023-07-23")).toISOString(),
        endDate: new Date(Date.now("2022-07-25")).toISOString()
      },
      {
        venueId: 5,
        groupId: 5,
        name: "Drinking Game Extravaganza",
        description: "Bouncing quarters into shot glasses since 2005",
        type: "In person",
        capacity: 10,
        price: 0,
        startDate: new Date(Date.now("2005-09-01")).toISOString(),
        endDate: new Date(Date.now("2023-12-31")).toISOString()
      },
      {
        venueId: 6,
        groupId: 6,
        name: "Wednesday night karaoke",
        description: "All your favorite songs being performed off-key",
        type: "In person",
        capacity: 50,
        price: 0,
        startDate: new Date(Date.now("2009-06-01")).toISOString(),
        endDate: new Date(Date.now("2023-12-31")).toISOString()
      },
      {
        venueId: 7,
        groupId: 7,
        name: "Sunday night Among Us",
        description: "Murder your friends and gaslight the innocent into accusing each other.",
        type: "Online",
        capacity: 15,
        price: 0,
        startDate: new Date(Date.now("2019-08-01")).toISOString(),
        endDate: new Date(Date.now("2023-12-31")).toISOString()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Events', {
      name: { [Op.in]: [
        "Practice Exam Walkthrough",
        "Tennis Tournament",
        "Pittsburgh Marathon",
        "Grand Prix Pittsburgh",
        "Drinking Game Extravaganza",
        "Wednesday night karaoke",
        "Sunday night Among Us"
      ] }
    }, {});
  }
};
