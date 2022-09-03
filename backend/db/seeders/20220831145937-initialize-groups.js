'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Groups', [
      {
        organizerId: 1,
        name: 'Homework Squad',
        about: 'a/A June 2022 Cohort',
        type: 'educational',
        private: true,
        numMembers: 71,
        previewImage: "https://images-na.ssl-images-amazon.com/images/I/51b0ugQtHbL._SX331_BO1,204,203,200_.jpg"
      },
      {
        organizerId: 4,
        name: 'Tennis Group',
        about: 'Local Tennis Players',
        type: 'athletic',
        private: false,
        city: 'Pittsburgh',
        state: "PA",
        numMembers: 4,
        previewImage: "https://thumbs.dreamstime.com/b/tennis-ball-tennis-court-photo-44444538.jpg"
      },
      {
        organizerId: 3,
        name: 'Cross Country Team',
        about: 'Highschool Team',
        type: 'athletic',
        private: false,
        city: 'Murrysville',
        state: "PA",
        numMembers: 26,
        previewImage: "https://media.istockphoto.com/photos/people-doing-cross-country-running-on-grass-picture-id174627365?k=20&m=174627365&s=612x612&w=0&h=QAc4VRHC-R7UFCDtSyQ4S0PKvGs4i09PVwZ8grSkpPo="
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Groups', {
      name: { [Op.in]: ["Homework Squad", "Tennis Group", "Cross Country Team"] }
    }, {});
  }
};
