'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('GroupImages', [
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
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('GroupImages', {}, {});
  }
};
