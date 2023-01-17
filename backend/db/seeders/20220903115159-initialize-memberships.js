'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Memberships'
    return queryInterface.bulkInsert(options, [
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
    options.tableName = "Memberships"
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete('Memberships', {}, {});
  }
};
