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
      },
      {
        eventId: 3,
        url: "https://p3r.org/media/W1siZiIsIjIwMjIvMDQvMTkvNXJpNHl1cXI4bV8yMDE5X1BpdHRzYnVyZ2hNYXJhdGhvbl9EdXJpc2tvXzAwMTMuSlBHIl1d/2019_PittsburghMarathon_Durisko_0013.JPG",
        preview: true
      },
      {
        eventId: 4,
        url: "https://api.hub.jhu.edu/factory/sites/default/files/styles/hub_xlarge/public/poker_impact_012820.jpg",
        preview: true
      },
      {
        eventId: 5,
        url: "https://dormhigh.com/wp-content/uploads/2014/02/quarters-drinking-game-1.jpg",
        preview: true
      },
      {
        eventId: 6,
        url: "https://pyxis.nymag.com/v1/imgs/885/19f/1778c5fe25e83a0d2e2e9a610889b918b2-karaoke-horizontal.2x.rsocial.w600.jpg",
        preview: true
      },
      {
        eventId: 7,
        url: "https://amongusplay.online/share.png",
        preview: true
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('EventImages', {}, {});
  }
};
