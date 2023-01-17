'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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
     options.tableName = 'Events'
     return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: "Practice Exam Walkthrough",
        description: "Where we go over the practice exam and ask questions to prepare for the assessment.",
        type: "Online",
        capacity: 10,
        price: 10,
        startDate:  new Date("2022-09-23").toISOString(),
        endDate: new Date("2022-09-25").toISOString()
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Tennis Tournament",
        description: `Thousands of tennis tournaments take place across the world every year, at many different levels. Most of these will have common features like knockout draws, qualifying events, an entry fee and/or prize money. Any tournament requires a substantial amount of organization. Beforehand, players must be accepted on an agreed basis, placed in an appropriate slot in the draw, and given all of the information they need.

        During the event, officials must be provided, and clear communication needs to continue. At higher levels, accommodation must be organized and prize money paid promptly. In 2020, the coronavirus pandemic has forced tournament organizers to instigate many additional protocols to ensure the safety of everyone involved.

        In essence, tennis tournaments work by accepting as many of the highest-ranked players as possible, given the maximum draw size they accommodate. There may be a qualifying draw to allow lower-ranked players a chance to play. Events normally run on a knockout basis, culminating in a final. Prize money and ranking points, if applicable, are awarded according to the stage reached.

        How Players Qualify for Tournaments
        There are many different levels of event but, whatever the standard, it is usual for the highest-ranked or rated players to be admitted first. If there are more entrants than spaces, there will be a cut-off below which players are added to a reserve list. In more prestigious tournaments there will often be a qualifying draw, in which the highest-ranked players who were not automatically admitted to the main draw play off to earn a small number of spots specifically allocated to qualifiers.

        The other common way of gaining admittance to a tournament is via a ‘wild card’ issued by the organizers. There will be a few wild card spaces in the main draw and the qualifying event to allow the organizers to admit any players they wish. These slots are intended to be filled by local players, or perhaps a former champion who no longer qualifies for direct acceptance. In the past, at the lower levels of professional tennis, some unscrupulous tournament organizers have accepted money to give players wild cards, but fortunately, this rarely occurs today.

        At professional level, entries will be determined primarily by ATP or WTA world rankings. The ITF World Tennis Tour is the level at which players must work hard to gain a world ranking, but even these events are not always easy to get into without one. This is where wild cards can be a great help to up and coming players.

        On the men’s side, ATP Challenger events are the next step up, whereas for the women there are higher tiers of ITF events. To get into these, a reasonable world ranking must have been earned through the lower level ITF tournaments.

        Finally, when a player reaches somewhere close to the top 100 in the world, they will have a chance of playing regularly on the main ATP or WTA Tour, and will be able to enter the most prestigious and lucrative events.

        We have written a full guide on how tennis players qualify for Grand Slam, and you can check it out here.`,
        type: "In person",
        capacity: 100,
        price: 15,
        startDate:  new Date(Date.now("2022-09-30")).toISOString(),
        endDate: new Date(Date.now("2022-10-03")).toISOString()
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Pittsburgh Marathon",
        description: "The DICK'S Sporting Goods Pittsburgh Marathon provides a 26.2 mile tour of Pittsburgh the best way we know how: on foot! Join thousands of your fellow runners on this trek through 14 distinct neighborhoods with more than 300,000 spectators cheering you on every step of the way.",
        type: "In person",
        capacity: 1000,
        price: 80,
        startDate: new Date(Date.now("2023-05-03")).toISOString(),
        endDate: new Date(Date.now("2022-05-05")).toISOString()
      },
      {
        venueId: 4,
        groupId: 4,
        name: "WPT Pittsburgh",
        description: `The World Poker Tour is thrilled to return to Rivers Casino Pittsburgh for WPTDeepStacks Pittsburgh!
        The full festival runs from October 17-28, 2019.

        WPTDeepStacks Pittsburgh features a $1,100 Buy-In, $300,000 Guaranteed  Main Event from October 24-28, 2019.  Players will receive a starting stack of 30,000 chips!

        $3,000 will be withheld from the total prize pool and awarded to the first place finisher in the form of (a) $2,500 entry into the WPTS Championship event and (b) $500 travel fund.

        This event offers your choice of three starting flights
        Day 1A: Thursday, October 24th @ 12:15PM
        Day 1B: Friday, October 25th @ 12:15PM
        Day 1C: Saturday, October 26th @ 12:15PM
        *** Registration & Unlimited Re-Buy on all Day 1's will remain open until the beginning of Level 10 (Around 7:45PM) ***
        Day 2: Sunday, October 27th @ 12:15PM
        Final Table: Monday, October 28th @ 12:15PM

        For main event satellites, side events, lodging, and additional casino information, please visit: https://www.riverscasino.com/pittsburgh/casino/poker-room/wpt-pittsburgh

        Must be 21 years old to enter Rivers Casino.

        Participation in WPT tournaments is subject to rules and rulings set forth by the applicable venue(s) and/or WPT (e.g., tournament rules, sponsors).

        All players at WPT events are solely responsible for retrieving their winnings from the host casino or poker room and the payment of any taxes or fees on such winnings requested by the host casino or poker room. Any question or dispute regarding winnings at a WPT event should be brought up directly with the host casino or poker room, which has sole responsibility therefore.

        WPT is not responsible for any tournament event details including, without limitation, structures, schedules, formats, general rules or prize pool distributions. Management reserves the right to change tournament dates or suspend or cancel tournaments, in whole or part, without notice for any reason at any time.`,
        type: "In person",
        capacity: 5000,
        price: 60,
        startDate: new Date(Date.now("2023-07-23")).toISOString(),
        endDate: new Date(Date.now("2022-07-25")).toISOString()
      },
      {
        venueId: 5,
        groupId: 5,
        name: "Drinking Game Extravaganza",
        description: "Bouncing quarters into shot glasses since 2005",
        type: "In person",
        capacity: 10,
        price: 0,
        startDate: new Date(Date.now("2005-09-01")).toISOString(),
        endDate: new Date(Date.now("2023-12-31")).toISOString()
      },
      {
        venueId: 6,
        groupId: 6,
        name: "Karaoke in Pittsburgh",
        description: `Bring Out The Sensational Star In You Out At The Karaoke Nights In Pittsburgh
        Anyone who is a fan of singing and not on a professional level but just enjoys the whole idea of singing, karaoke events are for each and every one of them. It is a fun way to celebrate life and happy times together with peers, friends and family. A happy occasion should end with a peppy karaoke night. For any opportunity that you find to celebrate, head to some of the best bars and clubs that host karaoke nights in Pittsburgh regularly. You will also be able to find frequently hosted karaoke events in Pittsburgh for people who enjoy singing in the company of their people and soak in the chill vibes with booze. Discover the best of karaoke nights near you and get in the mood to jam with your people.`,
        type: "In person",
        capacity: 50,
        price: 0,
        startDate: new Date(Date.now("2009-06-01")).toISOString(),
        endDate: new Date(Date.now("2023-12-31")).toISOString()
      },
      {
        venueId: 7,
        groupId: 7,
        name: "Sunday night Among Us",
        description: `Among Us[c] is a 2018 online multiplayer social deduction game developed and published by American game studio Innersloth. The game was inspired by the party game Mafia[10][11] and the science fiction horror film The Thing.[11] The game allows for cross-platform play, first released on iOS and Android devices in June 2018 and on Windows later that year in November. The game was then ported to the Nintendo Switch in December 2020, and on the PlayStation 4, PlayStation 5, Xbox One and Xbox Series X/S in December 2021. While the game was initially released in 2018 to little mainstream attention, it received a massive influx of popularity in 2020 due to many well-known Twitch streamers and YouTubers playing it. A separate VR version of the game, Among Us VR, was released in November 2022.

        Among Us takes place in space-themed settings where players are colorful armless cartoon astronauts; Each player takes on one of two roles: most are Crewmates, but a small number play Impostors,[d] which appear identical to Crewmates. The goal of the Crewmates is to either identify and vote out the Impostors, or to complete all the tasks around the map; the goal of the Impostors is to covertly sabotage the mission either by killing the Crewmates before they complete all their tasks or by triggering a disaster that is not resolved in time.`,
        type: "Online",
        capacity: 15,
        price: 0,
        startDate: new Date(Date.now("2019-08-01")).toISOString(),
        endDate: new Date(Date.now("2023-12-31")).toISOString()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    options.tableName = "Events"
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete('Events', {
    //   name: { [Op.in]: [
    //     "Practice Exam Walkthrough",
    //     "Tennis Tournament",
    //     "Pittsburgh Marathon",
    //     "Grand Prix Pittsburgh",
    //     "Drinking Game Extravaganza",
    //     "Wednesday night karaoke",
    //     "Sunday night Among Us"
    //   ] }
    // }, {});
  }
};
