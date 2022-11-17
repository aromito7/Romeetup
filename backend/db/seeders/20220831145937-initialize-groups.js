'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Groups', [
      {
        organizerId: 1,
        name: 'Homework squad',
        about: 'a/A June 2022 Cohort',
        type: 'Online',
        private: true,
        numMembers: 71,
        previewImage: "https://images-na.ssl-images-amazon.com/images/I/51b0ugQtHbL._SX331_BO1,204,203,200_.jpg"
      },
      {
        organizerId: 4,
        name: 'Tennis group',
        about: 'Local Tennis Players',
        type: 'In person',
        private: false,
        city: 'Pittsburgh',
        state: "PA",
        numMembers: 4,
        previewImage: "https://thumbs.dreamstime.com/b/tennis-ball-tennis-court-photo-44444538.jpg"
      },
      {
        organizerId: 3,
        name: 'Cross Country masochists',
        about: 'Highschool Team',
        type: 'In person',
        private: false,
        city: 'Murrysville',
        state: "PA",
        numMembers: 26,
        previewImage: "https://media.istockphoto.com/photos/people-doing-cross-country-running-on-grass-picture-id174627365?k=20&m=174627365&s=612x612&w=0&h=QAc4VRHC-R7UFCDtSyQ4S0PKvGs4i09PVwZ8grSkpPo="
      },
      {
        organizerId: 5,
        name: 'The cardboard dojo',
        about: 'Gathering of people who like to play Poker, MTG, and all types of board games.',
        type: 'In person',
        private: true,
        city: 'Pittsburgh',
        state: 'PA',
        numMembers: 8,
        previewImage: "https://api.hub.jhu.edu/factory/sites/default/files/styles/hub_xlarge/public/poker_impact_012820.jpg"
      },
      {
        organizerId: 6,
        name: 'Drinking game debauchery group',
        about: 'Quarters, kings, pong, F the dealer, and all other sorts of chaotic weekend fun.',
        type: 'In person',
        private: true,
        city: 'Pittsburgh',
        state: 'PA',
        numMembers: 10,
        previewImage: "https://dormhigh.com/wp-content/uploads/2014/02/quarters-drinking-game-1.jpg"
      },
      {
        organizerId: 7,
        name: 'Karaoke club',
        about: 'A group of friends singing all your favorites songs horribly off-key.',
        type: 'In person',
        private: false,
        city: 'Pittsburgh',
        state: 'PA',
        numMembers: 20,
        previewImage: "https://pyxis.nymag.com/v1/imgs/885/19f/1778c5fe25e83a0d2e2e9a610889b918b2-karaoke-horizontal.2x.rsocial.w600.jpg"
      },
      {
        organizerId: 7,
        name: 'Martini Discord Server',
        type: 'Online',
        private: true,
        city: 'Pittsburgh',
        state: 'PA',
        numMembers: 5,
        previewImage: "https://mentalmars.b-cdn.net/wp-content/uploads/2016/05/Heroes_of_the_Storm_Wallpaper_-_Preview.jpg"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Groups', {
      name: { [Op.in]: ["Homework squad", "Tennis group", "Cross Country Masochists", "Cardboard dojo", 'Drinking game debauchery group', "Karaoke club", "HotS discord"] }
    }, {});
  }
};
