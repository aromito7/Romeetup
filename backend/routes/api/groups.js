// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Venue, Event } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const venue = require('../../db/models/venue');

const router = express.Router();

const validateCreation = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 60})
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more'),
  check('type')
    .exists({ checkFalsy: true })
    .custom((type) => ['online', 'in person'].includes(type.toLowerCase()))
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .isBoolean()
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  handleValidationErrors
];

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

const validateEvent = [
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

router.get(
  '/',
  async (req, res) => {
    const groups = await Group.findAll({});
    return res.json({
      groups
    });
  }
);

router.get(
  '/current',
  async (req, res, next) => {
    const { user } = req;
    if (user) {
      const groups = await Group.findAll({
        where: {
          organizerId: user.toSafeObject().id
        }
      });
      return res.json({
        groups
      });
    }else{
      return res.json({"Message": "Not logged in."})
    }
  }
);

router.get(
  '/:groupId',
  async (req, res, next) => {
    const { groupId } = req.params;
    const groups = await Group.findByPk(groupId)
    if(groups){
      return res.json({
        groups
      });
    }else{
      res.statusCode = 404
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.put(
  '/:groupId',
  validateCreation,
  async (req, res, next) => {
    const { groupId } = req.params;
    const { name, about, type, private, city, state } = req.body
    const fields = {name, about, type, private, city, state}

    const group = await Group.findByPk(groupId);

    if(group){
      for(i in fields){
        if(fields[i] !== undefined)
          //console.log(`${i}: ${fields[i]}`)
          group[i] = fields[i]
      }

      group.save()
      res.json({group})
    }
    else{
      res.statusCode = 404
      res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.delete(
  '/:groupId',
  async (req, res, next) => {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);

    if(group){

      group.destroy()
      res.json({
        message: "Successfully deleted",
        statusCode: 200
      })
    }
    else{
      res.statusCode = 404
      res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.post(
  '/:groupId/images',
  async (req, res, next) => {
    const { groupId } = req.params;
    const { url, preview } = req.body;
    const group = await Group.findByPk(groupId);
    if(group){
      group.previewImage = url
      group.save()
      const {id} = group
      return res.json({
        id,
        url,
        preview
      });
    }
    else{
      res.statusCode = 404
      res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.post(
  '/:groupId/venues',
  validateVenue,
  async (req, res, next) => {
    const { groupId } = req.params
    const group = await Group.findByPk(groupId)
    if(group){
      const { address, city, state, lat, lng } = req.body
      console.log(Venue)
      const newVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng
      });

      return res.json({
        id: venue.id,
        groupId,
        address,
        city,
        state,
        lat,
        lng
      });
    }else{
      res.status = 404
      res.message = "Group couldn't be found"
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.get(
  '/:groupId/venues',
  async (req, res, next) => {
    const { groupId } = req.params
    const venue = await Venue.findByPk(groupId)
    if(venue){
      return res.json({
        Venues: venue
      });
    }else{
      res.statusCode = 404
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.get(
  '/:groupId/events',
  async (req, res, next) => {
    const { groupId } = req.params
    const event = await Event.findByPk(groupId)
    if(event){
      return res.json({
        Events: event
      });
    }else{
      res.statusCode = 404
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.post(
  '/:groupId/events',
  validateEvent,
  async (req, res, next) => {
    const { groupId } = req.params
    const group = await Group.findByPk(groupId)
    if(group){
      const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
      console.log(startDate)
      const newEvent = await Event.create({
        groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
      });

      return res.json({
        newEvent
        // venueId,
        // name,
        // type,
        // capacity,
        // price,
        // description,
        // startDate,
        // endDate
      });
    }else{
      res.status = 404
      res.message = "Group couldn't be found"
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.post(
  '/',
  validateCreation,
  async (req, res, next) => {
    const { organizerId, name, about, type, private, city, state } = req.body
    const newGroup = await Group.create({ organizerId, name, about, type, private, city, state})
    return res.json({
      newGroup
    });
  }
);


module.exports = router;
