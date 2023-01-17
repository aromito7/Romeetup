'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups'
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Homework squad',
        about: `A study group is a small group of
        students taking the same class who meet
        regularly outside of class time. Members
        of the study group commit to helping
        each other be successful by working
        together.
        A study group is usually formed and run
        by the students involved.`,
        type: 'Online',
        private: true,
        numMembers: 71,
        previewImage: "https://images-na.ssl-images-amazon.com/images/I/51b0ugQtHbL._SX331_BO1,204,203,200_.jpg"
      },
      {
        organizerId: 4,
        name: 'Tennis group',
        about: `Thousands of tennis tournaments take place across the world every year, at many different levels. Most of these will have common features like knockout draws, qualifying events, an entry fee and/or prize money. Any tournament requires a substantial amount of organization. Beforehand, players must be accepted on an agreed basis, placed in an appropriate slot in the draw, and given all of the information they need.
        During the event, officials must be provided, and clear communication needs to continue. At higher levels, accommodation must be organized and prize money paid promptly. In 2020, the coronavirus pandemic has forced tournament organizers to instigate many additional protocols to ensure the safety of everyone involved.
        In essence, tennis tournaments work by accepting as many of the highest-ranked players as possible, given the maximum draw size they accommodate. There may be a qualifying draw to allow lower-ranked players a chance to play. Events normally run on a knockout basis, culminating in a final. Prize money and ranking points, if applicable, are awarded according to the stage reached.\
        How Players Qualify for Tournaments
        There are many different levels of event but, whatever the standard, it is usual for the highest-ranked or rated players to be admitted first. If there are more entrants than spaces, there will be a cut-off below which players are added to a reserve list. In more prestigious tournaments there will often be a qualifying draw, in which the highest-ranked players who were not automatically admitted to the main draw play off to earn a small number of spots specifically allocated to qualifiers.
        The other common way of gaining admittance to a tournament is via a ‘wild card’ issued by the organizers. There will be a few wild card spaces in the main draw and the qualifying event to allow the organizers to admit any players they wish. These slots are intended to be filled by local players, or perhaps a former champion who no longer qualifies for direct acceptance. In the past, at the lower levels of professional tennis, some unscrupulous tournament organizers have accepted money to give players wild cards, but fortunately, this rarely occurs today.
        At professional level, entries will be determined primarily by ATP or WTA world rankings. The ITF World Tennis Tour is the level at which players must work hard to gain a world ranking, but even these events are not always easy to get into without one. This is where wild cards can be a great help to up and coming players.
        On the men’s side, ATP Challenger events are the next step up, whereas for the women there are higher tiers of ITF events. To get into these, a reasonable world ranking must have been earned through the lower level ITF tournaments.
        Finally, when a player reaches somewhere close to the top 100 in the world, they will have a chance of playing regularly on the main ATP or WTA Tour, and will be able to enter the most prestigious and lucrative events.
        We have written a full guide on how tennis players qualify for Grand Slam, and you can check it out here.`,
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
        about: `Cross Country (abbreviated CC or XC) is a running event in which runners compete to complete a course over open or rough terrain. The courses used at these events may include grass, mud, woodlands, hills, flat ground and water. It is a popular participatory sport, and usually takes place in temperate regions during the autumn and winter when soft conditions underfoot prevail.

        It is one of the sports which, along with track and field, road running, and racewalking, makes up the umbrella sport of athletics. The foremost elite competition is the IAAF World Cross Country Championships. Cross country also features as part of themodern pentathlon at the Summer Olympic Games. Cross country featured on the Olympic athletics programme between 1912 and 1924 but was dropped for following editions.`,
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
        about: `Discord is a voice, video, and text chat app that's used by tens of millions of people ages 13+ to talk and hang out with their communities and friends.
        People use Discord daily to talk about many things, ranging from art projects and family trips to homework and mental health support. It's a home for communities of any size, but it's most widely used by small and active groups of people who talk regularly.
        The vast majority of servers are private, invite-only spaces for groups of friends and communities to stay in touch and spend time together. There are also larger, more open communities, generally centered around specific topics such as popular games like Minecraft and Fortnite. Users have control over whom they interact with and what their experience on Discord is.
        People love Discord because it’s a home for all their communities and groups of friends. It's a place where they can be themselves and spend time with other people who share their interests and hobbies. Conversations on Discord are driven by the people you choose and the topics you choose to talk about.`,
        type: 'Online',
        private: true,
        city: 'Pittsburgh',
        state: 'PA',
        numMembers: 5,
        previewImage: "https://i.pcmag.com/imagery/articles/05igsUpNyvUwzFGsEFGydTN-1.fit_lim.size_1600x900.v1657469410.jpg"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    options.tableName = "Groups"
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete('Groups', {
    //   name: { [Op.in]: ["Homework squad", "Tennis group", "Cross Country Masochists", "Cardboard dojo", 'Drinking game debauchery group', "Karaoke club", "HotS discord"] }
    // }, {});
  }
};
