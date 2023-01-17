'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: "https://media4.giphy.com/media/xUPGcmvgjMIEhy6jZu/giphy.gif?cid=790b76116b17fc1a2b759464554516a3bbcc58d85fb8b3f3&rid=giphy.gif&ct=g",
        preview: true
      },
      {
        //Backup url: https://memegenerator.net/img/instances/67870883/its-so-simple-the-files-are-in-the-computer.jpg
        groupId: 2,
        url: "https://images.ctfassets.net/3s5io6mnxfqz/7qYAiFTwyMaA3A1Q0iqgLD/92eafb866dc9b2b8a650c147d637bfb9/AdobeStock_246336340.jpeg",
        preview: true
      },
      {
        groupId: 3,
        url: "https://www.williamsburg.k12.pa.us/cms/lib/PA01001585/Centricity/Domain/91/cross-country-clip-art-many-interesting-cliparts-png-clipartpost-cross-country-png-600_600.png",
        preview: true
      },
      {
        groupId: 4,
        url: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/05/MTG-cards-in-hand.jpg",
        preview: true
      },
      {
        groupId: 5,
        url: "https://dormhigh.com/wp-content/uploads/2014/02/quarters-drinking-game-1.jpg",
        preview: true
      },
      {
        groupId: 6,
        url: "https://img.freepik.com/free-vector/karaoke-with-microphones-stars-neon-style_24908-60794.jpg?w=2000",
        preview: true
      },
      {
        groupId: 7,
        url: "https://www.kindpng.com/picc/m/573-5738120_play-among-us-on-pc-among-us-em.png",
        preview: true
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    options.tableName = "GroupImages"
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete('GroupImages', {}, {});
  }
};
