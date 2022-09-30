// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Venue, Group, Membership } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateVenue = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is not valid'),
  handleValidationErrors
];

const isAuthorized = (currentUser, group, memberships) => {
  console.log([
    {currentUser: currentUser},
    group,
    memberships
  ])
  if(memberships){  //Needs to be tested on code with memberships
    const currentUserMemberships = memberships.filter( m => m.userId === currentUser.id)
    console.log(memberships, currentUserMemberships)
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

router.put(
  '/:venueId',
  restoreUser,
  requireAuth,
  validateVenue,
  async (req, res, next) => {
    const { venueId } = req.params
    const { address, city, state, lat, lgn } = req.body
    const fields = { address, city, state, lat, lgn }
    const {user} = req

    const venue = await Venue.findByPk(venueId);
    const {groupId} = venue
    const group = await Group.findByPk(groupId);
    const memberships = await Membership.findAll({where: {groupId}})

    if(!venue){
      res.statusCode = 404
      return res.json({
        message: "Venue couldn't be found",
        statusCode: 404
      })
    }
    if(!isAuthorized(user, group, memberships)){
      return notAuthorized(res)
    }
    for(i in fields){
      if(fields[i] !== undefined)
        venue[i] = fields[i]
    }

    venue.save()
    res.json(venue)
  });

  router.get(
    '/',
    async (req, res, next) => {
      const venues = await Venue.findAll()

      res.json(venues)
    }
  )




  module.exports = router;
