// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');
const { secret, expiresIn } = jwtConfig;


// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const token = jwt.sign(
      { data: user.toSafeObject() },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
  };

  const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.scope('currentUser').findByPk(id);
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
  };

// If there is no current user, return an error
  const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Unauthorized';
    //err.errors = ['Unauthorized'];
    err.status = 401;
    return next(err);
  }

  const isAuthorized = (currentUser, group, memberships) => {
    // console.log([
    //   {currentUser: currentUser},
    //   group,
    //   memberships
    // ])
    if(memberships){  //Needs to be tested on code with memberships
      const currentUserMemberships = memberships.filter( m => m.userId === currentUser.id)
      //console.log(memberships, currentUserMemberships)
      if(currentUserMemberships[0].status.match(/^co-host$/i)){
        return true
      }
    }

    if(currentUser.id === group.organizerId){
      return true
    }

    return false
  }

  const notAuthorized = res => {
    res.statusCode = 403
    res.message = "Forbidden"
    return res.json({
      message: "Forbidden",
      statusCode: 403
    })
  }

  const groupNotFound = res => {
    res.statusCode = 404
    res.message = "Group couldn't be found"
    return res.json({
      message: "Group couldn't be found",
      statusCode: 404
    })
  }

  const eventNotFound = res => {
    res.message = "Event couldn't be found"
    res.statusCode = 404
    return res.json({
      message: "Event couldn't be found",
      statusCode: 404
    })
  }

  const venueNotFound = res => {
    res.message = "Venue couldn't be found"
    res.statusCode = 404
    return res.json({
      message: "Venue couldn't be found",
      statusCode: 404
    })
  }

  const isAttendee = (currentUser, attendees) => {
    console.log([
      {currentUser: currentUser},
      attendees
    ])
    if(attendees){  //Needs to be tested on code with memberships
      const currentUserMemberships = attendees.filter( m => m.userId === currentUser.id)
      //console.log(attendees, currentUserMemberships)
      if(currentUserMemberships.length > 0){
        return true
      }
    }

    return false
  }


  module.exports = { setTokenCookie, restoreUser, requireAuth, isAuthorized, notAuthorized, groupNotFound, isAttendee, eventNotFound, venueNotFound };
