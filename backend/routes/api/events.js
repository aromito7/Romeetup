// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser, requireAuth, isAttendee, notAuthorized, eventNotFound, groupNotFound, venueNotFound, isAuthorized } = require('../../utils/auth');
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

// const eventNotFound = res => {
//   res.message = "Event couldn't be found"
//   res.statusCode = 404
//   return res.json({
//     message: "Event couldn't be found",
//     statusCode: 404
//   })
// }

// const isAttendee = (currentUser, attendees) => {
//   console.log([
//     {currentUser: currentUser},
//     attendees
//   ])
//   if(attendees){  //Needs to be tested on code with memberships
//     const currentUserMemberships = attendees.filter( m => m.userId === currentUser.id)
//     console.log(attendees, currentUserMemberships)
//     if(currentUserMemberships.length > 0){
//       return true
//     }
//   }

//   return false
// }

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
      {model: Group, attributes: ["id", "name", "city", "state"], include: User},
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
    const query = {}
    query.include = [
      {model: Group, attributes: ["id", "name", "city", "state"], include: User},
      {model: Venue, attributes: ["id", "city", "state"]},
      {model: EventImage, limit: 1, attributes: ["url"], where: {preview: true}}]
    const event = await Event.findByPk(eventId, query)
    if(event){
      return res.json(event);
    }else{
      return eventNotFound(res)
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
    const { venueId, name, type, capacity, price, description, startDate, endDate} = req.body
    const fields = {name, type, capacity, price, description, startDate, endDate}
    const {user} = req
    const event = await Event.findByPk(eventId);

    if(!event){
      return eventNotFound(res)
    }

    const venue = await Venue.findByPk(venueId)
    if(!venue){
      return venueNotFound(res)
    }
    const {groupId} = event
    const group = await Group.findByPk(groupId)
    if(!group){
      return groupNotFound(res)
    }


    const memberships = await Membership.findAll({where: {groupId}})
    if(!isAuthorized(user, group, memberships)){
      return notAuthorized(res)
    }

    for(i in fields){
      if(fields[i] !== undefined)
        event[i] = fields[i]
    }

    event.save()
    const {id} = event
    return res.json({
      id,
      groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate
    })
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
      return eventNotFound(res)
    }

    const attendees = await Attendance.findAll({where: {eventId}})

    if(!isAttendee(user, attendees)){
      return notAuthorized(res)
    }

    const {url, preview} = req.body
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
      return eventNotFound(res)
    }
    const group = event.Group
    const {groupId} = event
    const memberships = await Membership.findAll({where: {groupId}})

    //need to add permission for
    if(!isAuthorized(user, group, memberships)){
      return notAuthorized(res)
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
    const {memberId} = req.body

    const event = await Event.findByPk(eventId, {include: [Attendance, Group]})
    if(!event){
      return eventNotFound(res)
    }

    const group = await Group.findByPk(event.Group.id, {include: Membership})
    //const [attendance] = event.Attendances.filter(att => att.userId === userId)
    const [attendance] = await Attendance.findAll({where: {eventId: event.id, userId:memberId}})
    if(!attendance){
      res.statusCode = 404
      res.json({
        "message": "Attendance between the user and the event does not exist",
        "statusCode": 404
      })
    }


    if(!(user.id === memberId || user.id === group.organizerId)){
      return notAuthorized(res)
    }

    await attendance.destroy()
    return res.json({
      message: "Successfully deleted attendance from event"
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

    const event = await Event.findByPk(eventId, {include: [Attendance, {model: Group}]})//, include: {model: Membership}}]})
    if(!event){
      return eventNotFound(res)
    }
    const group = event.Group//await Group.findByPk(event.Group.id, {include: Membership})

    let attendance //= event.Attendances//event.Attendances.filter(att => att.userId === userId)

    event.Attendances.forEach(att=> {
      if(att.userId === user.id) attendance = att
    })

    if(!attendance){
      res.statusCode = 404
      res.json({
        "message": "Attendance between the user and the event does not exist",
        "statusCode": 404
      })
    }


    const groupId = event.Group.id
    const memberships = await Membership.findAll({where: {groupId}})

    if(!isAuthorized(user, group, memberships)){
      return notAuthorized(res)
    }

    if(!['member', 'attending', 'waitlist', 'pending'].includes(status.toLowerCase())){
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
      return eventNotFound(res)
    }
    const {groupId} = event

    const memberships = await Membership.findAll({where: {groupId}})
    if(memberships.filter(m => m.userId === user.id).length < 1){
      return notAuthorized(res)
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

    const newAttendance = await Attendance.create({
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
    if(!event){
      return eventNotFound(res)
    }
    const group = event.Group
    const groupId = group.id
    const attendees = await User.findAll({include: {attributes: ["status"], model: Attendance, where: {eventId}}})
    const memberships = await Membership.findAll({where: {groupId}})

    if(!event){
      res.statusCode = 404
      return res.json({
        message: "Event couldn't be found",
        statusCode: 404
      })
    }
    const member = event.Group.Memberships.filter(mem => mem.userId === user.id)[0]
    //return res.json(member)
    if(isAuthorized(user, group, memberships)){
      return res.json({"Attendees" : attendees})
    }

    return res.json({"Attendees": attendees})
  }
)

module.exports = router;
