'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues'
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: "a/A Discord",
        city: "Discord",
        state: "The Internet",
        lat: 42.0420,
        lng: 42.0420
      },
      {
        groupId: 2,
        address: "Arsenal Tennis Courts",
        city: "Lawrenceville",
        state: "PA",
        lat: 40.4664,
        lng: 79.9609
      },
      {
        groupId: 3,
        address: "North Side",
        city: "Pittsburgh",
        state: "PA",
        lat: 40.4573,
        lng: 80.0070
      },
      {
        groupId: 4,
        address: "David L. Lawrence Convention Center",
        city: "Pittsburgh",
        state: "PA",
        lat: 40.2645,
        lng: 79.5947
      },
      {
        groupId: 5,
        address: "Marini's House",
        city: "Greenfield",
        state: "PA",
        lat: 39.7850,
        lng: 85.7694
      },
      {
        groupId: 6,
        address: 'Hemingways Cafe',
        city: 'Oakland',
        state: 'PA',
        lat: 40.4321,
        lng: 79.9585
      },
      {
        groupId: 7,
        address: 'Martini Discord Channel',
        city: 'Discord',
        state: 'Internet',
        lat: 42.0420,
        lng: 42.0420
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    options.tableName = "Venues"
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete('Venues', {
    //   address: { [Op.in]: ["a/A Discord", "Arsenal Tennis Courts", "North Side", "Convention Center"]}
    // }, {});
  }
};
