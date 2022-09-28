// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Venue } = require('../../db/models');
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

router.put(
  '/:venueId',
  requireAuth,
  validateVenue,
  async (req, res, next) => {
    const { venueId } = req.params
    const { address, city, state, lat, lgn } = req.body
    const fields = { address, city, state, lat, lgn }
    const { user } = req
    const venue = await Venue.findByPk(venueId);

    if(venue){
      for(i in fields){
        if(fields[i] !== undefined)
          venue[i] = fields[i]
      }

      venue.save()
      res.json(venue)
    }
    else{
      res.statusCode = 404
      res.json({
        message: "Venue couldn't be found",
        statusCode: 404
      })
    }
  });

  router.get(
    '/',
    async (req, res, next) => {
      const venues = await Venue.findAll()

      res.json(venues)
    }
  )




  module.exports = router;
