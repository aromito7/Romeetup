// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Event, EventImage, Venue, Group, Membership, Attendance, User } = require('../../db/models');
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
    let {page, size, name, type, startDate} = req.query

    const where = {page: 1, size: 20}
    const query = {}
    const errors = {}

    if(page){
      if(isNaN(page) || page < 0){
        errors.page = "Page must be a number greater than or equal to 0"
      }else if(page <= 10){
        where.page = Math.floor(page)
      }else{
        where.page = 10
      }
    }

    if(size){
      if(isNaN(size) || size < 0){
        errors.size = "Size must be a number greater than or equal to 0"
      }else if(size <= 20){
        where.size = Math.floor(size)
      }
    }

    query.limit = where.size
    query.offset = (where.page - 1) * where.size
    query.include = [
      {model: Group, attributes: ["id", "name", "city", "state"]},
      {model: Venue, attributes: ["id", "city", "state"]},
      {model: EventImage, limit: 1, attributes: ["url"], where: {preview: true}}]

    if(name){
      if(isNaN(name)){
        where.name = name
      }else{
        errors.name = "Name must be a string"
      }
    }

    if(type){
      if(type.match(/^(online|in person)$/i)){
        where.type = type.match(/^online$/i) ? "Online" : "In Person"
      }else{
        errors.type = "Type must be 'Online' or 'In Person'"
      }
    }

    if(startDate){
      if(isNaN(new Date(startDate))){
        errors.startDate = "Start date must be a valid datetime"
      }else{
        where.startDate = startDate
      }
    }

    query.where = where
    delete where.page;
    delete where.size;


    if(Object.keys(errors).length > 0){
      res.statusCode = 400
      return res.json({
        message: "Validation Error",
        statusCode: 400,
        errors
      })
    }
    const events = await Event.findAll(query);
    return res.json(events);
  });

router.get(
  '/:eventId',
  async (req, res) => {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId, {include: ["Venue", "Group", "EventImages"]})
    if(event){
      return res.json(event);
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
  restoreUser,
  requireAuth,
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
    const { user } = req
    if(!user){
      return authRequired(res)
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
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { eventId } = req.params;

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

router.delete(
  '/:eventId/attendance',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { eventId } = req.params
    const { user } = req
    const {userId} = req.body

    const event = await Event.findByPk(eventId, {include: [Attendance, Group]})
    if(!event){
      res.statusCode = 404
      return res.json({
        "message": "Event couldn't be found",
        "statusCode": 404
      })
    }

    const group = await Group.findByPk(event.Group.id, {include: Membership})
    //const [attendance] = event.Attendances.filter(att => att.userId === userId)
    const attendance = await Attendance.findAll({where: {eventId: event.id, userId}})
    if(attendance.length < 1){
      res.statusCode = 404
      res.json({
        "message": "Attendance between the user and the event does not exist",
        "statusCode": 404
      })
    }

    const membership = await Membership.findAll({where: {userId: user.id, groupId: group.id}})
    if(membership && (event.Group.organizerId === user.id || membership[0].status.toLowerCase() === "co-host")){
      await attendance[0].destroy()
      return res.json({
        message: "Successfully deleted attendance from event"
      })
    }
    res.statusCode = 403
    return res.json({
      message: "You don't have permission to delete attendees",
      statusCode: 403
    })
  }
)

router.put(
  '/:eventId/attendance',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { eventId } = req.params
    const { user } = req
    const {userId, status} = req.body

    const event = await Event.findByPk(eventId, {include: [Attendance, {model: Group, include: {model: Membership}}]})
    if(!event){
      res.statusCode = 404
      return res.json({
        "message": "Event couldn't be found",
        "statusCode": 404
      })
    }
    const group = await Group.findByPk(event.Group.id, {include: Membership})
    const [attendance] = event.Attendances.filter(att => att.userId === userId)
    const [membership] = event.Group.Memberships.filter(mem => mem.userId = user.id)
    if(!attendance){
      res.statusCode = 404
      res.json({
        "message": "Attendance between the user and the event does not exist",
        "statusCode": 404
      })
    }

    if(membership && (event.Group.organizerId === user.id || membership.status.toLowerCase() === "co-host")){

      if(!['member', 'waitlist', 'pending'].includes(status.toLowerCase())){
        res.statusCode = 400
        return res.json({
          message: "That is not a valid status for an attendee",
          statusCode: 400
        })
      }
      if(status.toLowerCase() === "pending"){
        res.statusCode = 404
        return res.json({
          message: "Cannot change an attendance status to pending",
          statusCode: 400
        })

      }
      attendance.status = status
      attendance.save()
      return res.json(attendance)
    }

    return res.json({
      statusCode: 403,
      message: "You need to be an organizer or co-host to change status."
    })
  }
)

router.post(
  '/:eventId/attendance',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { eventId } = req.params
    const { user } = req

    const event = await Event.findByPk(eventId, {include: Attendance})


    if(!event){
      res.statusCode = 404
      return res.json({
        "message": "Event couldn't be found",
        "statusCode": 404
      })
    }

    const attendance = event.Attendances.filter(att => att.userId === user.id)[0]

    if(attendance){
      const status = attendance.status
      res.status
      if(status.toLowerCase() === "pending"){
        return res.json({
          "message": "Attendance has already been requested",
          "statusCode": 400
        })
      }else{
        return res.json({
          "message": "User is already an attendee of the event",
          "statusCode": 400
        })
      }
    }

    const newAttendance = Attendance.create({
      eventId: event.id,
      userId: user.id,
      status: "pending"
    })

    return res.json(newAttendance)
  }
)

router.get(
  '/:eventId/attendees',
  restoreUser,
  async (req, res, next) => {
    const {user} = req;
    const {eventId} = req.params;

    const event = await Event.findByPk(eventId, {include: {model: Group, include: Membership}})
    const attendees = await User.findAll({include: {attributes: ["status"], model: Attendance, where: {eventId}}})


    if(!event){
      res.statusCode = 404
      return res.json({
        message: "Event couldn't be found",
        statusCode: 404
      })
    }
    const member = event.Group.Memberships.filter(mem => mem.userId === user.id)[0]
    //return res.json(member)
    if(member && (event.Group.organizerId === user.id || member.status.toLowerCase() === "co-host")){
      return res.json({"Attendees" : attendees})
    }


    return res.json({"Attendees": attendees.filter(att => att.Attendances[0].status !== "pending")})
  }
)

module.exports = router;
