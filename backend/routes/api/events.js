// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Event, EventImage, Venue, Group, Membership } = require('../../db/models');
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
    const {eventId} = req.params
    const {venueId} = req.body
    const venue = await Venue.findByPk(venueId)
    if(!venue){
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
  restoreUser,
  async (req, res) => {
    const { user } = req;
    if (!user) {
      return res.json({"Message": "Not logged in."})
    }

    const {eventId} = req.params;
    const event = await Event.findByPk(eventId, {include: Group})
    if(!event){
      res.statusCode = 404
      res.message = "Event couldn't be found"
      return res.json({
        message: res.message,
        statusCode: res.statusCode
      })
    }

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
    }
  }
);

router.delete(
  '/:eventId',
  restoreUser,
  async (req, res, next) => {
    const { user } = req;
    const { eventId } = req.params;
    if(!user){
      res.statusCode = 404
      return res.json({
        "Message": "Not logged in.",
        statusCode: 404
      })
    }
    const event = await Event.findByPk(eventId, {include: {model: Group, include: Membership}});

    if(!event){
      res.statusCode = 404
      return res.json({
        message: "Event couldn't be found",
        statusCode: 404
      })
    }

    //need to add permission for
    if(event.Group.organizerId !== user.id){
      res.statusCode = 403
      return res.json({
        message: "Only an organizer or co-host can delete an event.",
        statusCode: 403
      })
    }

    event.destroy()
    return res.json({
      message: "Successfully deleted"
    });

  }
)

module.exports = router;
