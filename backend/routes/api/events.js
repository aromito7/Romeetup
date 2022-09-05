// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Event, EventImage, Venue, Group } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateEvent = [
  check('venueId')
    .exists({ checkFalsy: true })
    .withMessage('Venue does not exist'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({min: 5})
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .exists({ checkFalsy: true })
    .custom((type) => ['online', 'in person'].includes(type.toLowerCase()))
    .withMessage("Type must be 'Online' or 'In person'"),
  check('capacity')
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Price is invalid"),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check('startDate')
    .exists({ checkFalsy: true })
    .custom((startDate) => new Date(startDate) - new Date() > 0)
    .withMessage("Start date must be in the future"),
  check('endDate')
    .exists({ checkFalsy: true })
    .custom((endDate, {req}) => new Date(endDate) - new Date(req.body.startDate) > 0)
    .withMessage("End date must be after the start date"),
  handleValidationErrors
];

router.get(
  '/',
  async (req, res, next) => {

    const events = await Event.findAll({});

    return res.json({
      events
    });
  });

router.get(
  '/:eventId',
  async (req, res) => {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId, {include: ["Venue", "Group", "EventImages"]})
    if(event){
      return res.json({
        event
      });
    }else{
      res.statusCode = 404
      return res.json({
        message: "Event couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.put(
  '/:eventId',
  validateEvent,
  async (req, res) => {
    console.log("Hello, world!")
    const {eventId} = req.params
    const {venueId} = req.body
    const venue = await Venue.findByPk(venueId)
    console.log("Venue" + venue)
    if(!venue){
      console.log("hello")
      res.statusCode = 404
      res.message = "Venue couldn't be found"
      return res.json({
        message: "Venue couldn't be found",
        statusCode: 404
      })
    }
    const { name, type, capacity, price, description, startDate, endDate} = req.body
    const fields = {venueId, name, type, capacity, price, description, startDate, endDate}
    const event = await Event.findByPk(eventId);
    if(event){
      for(i in fields){
        if(fields[i] !== undefined)
          //console.log(`${i}: ${fields[i]}`)
          event[i] = fields[i]
      }

      event.save()
      return res.json(event)
    }
    else{
      res.statusCode = 404
      return res.json({
        message: "Event couldn't be found",
        statusCode: 404
      })
    }
  }
);

router.post(
  '/:eventId/images',
  async (req, res) => {
    const {eventId} = req.params;
    const event = await Event.findByPk(eventId)
    const {url, preview} = req.body
    if(event){
      const newEventImage = await EventImage.create({
        eventId,
        url,
        preview
      })
      return res.json({
        id: newEventImage.id,
        url,
        preview
      })
    }else{
      res.statusCode = 404
      res.message = "Event couldn't be found"
      return res.json({
        message: res.message,
        statusCode: res.statusCode
      })
    }
  }
);

router.delete(
  '/:eventId',

  async (req, res, next) => {
    const { user } = req;
    if (user) {
      const group = await Group.findByPk({
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
)

module.exports = router;
