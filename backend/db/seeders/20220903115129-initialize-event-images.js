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
     return queryInterface.bulkInsert('EventImages', [
      {
        eventId: 1,
        url: "https://www.mooc.org/hubfs/what-computer-programming-jobs-offer-remote-work-jpg.jpeg",
        preview: true
      },
      {
        eventId: 2,
        url: "https://www.naomiosaka.com/wp-content/uploads/2021/05/naomi-tennis-pro.jpg",
        preview: false
      },
      {
        eventId: 2,
        url: "https://cdn.pixabay.com/photo/2020/11/27/18/59/tennis-5782695__340.jpg",
        preview: true
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('EventImages', {}, {});
  }
};
