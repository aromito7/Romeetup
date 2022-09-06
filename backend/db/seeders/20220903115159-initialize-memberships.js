'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Memberships', [
      {
        userId: 1,
        groupId: 1,
        status: "co-host"
      },
      {
        userId: 2,
        groupId: 1,
        status: "member"
      },
      {
        userId: 3,
        groupId: 2,
        status: "co-host"
      },
      {
        userId: 3,
        groupId: 1,
        status: "pending"
      },
      {
        userId: 4,
        groupId: 1,
        status: "pending"
      },
      {
        userId: 4,
        groupId: 2,
        status: "pending"
      },
      {
        userId: 1,
        groupId: 2,
        status: "co-host"
      }

    ], {});
  },
  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Memberships', {}, {});
  }
};
