// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Venue, Event, Membership, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const venue = require('../../db/models/venue');
const { Op } = require('sequelize');
const { execSync } = require('child_process')

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

const authRequired = (res) => {
  res.statusCode = 401
  res.message = "Authentication required"
  return res.json({
    statusCode: 401,
    message: "Authentication required"
  })
}

router.get(
  '/',
  async (req, res) => {
    const groups = await Group.findAll({});

    return res.json(groups);
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
      return res.json(groups);
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
      return res.json(groups);
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

    // return res.json({groupId, url, preview})
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
      const newVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng
      });

      return res.json({
        id: newVenue.id,
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
    const events = await Event.findAll({where: {groupId}})
    if(events.length){
      return res.json({
        Events: events
      });
    }else{
      res.statusCode = 404
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404,
        groupId
      })
    }
  }
);

router.post(
  '/:groupId/events',
  validateEvent,            //For postman test to create event by invalid groupId is it ok if validator checks for errors before my code checks URL params?
  restoreUser,
  async (req, res, next) => {
    const { user } = req;
    const { groupId } = req.params
    if (!user) {
      return res.json({"Message": "Not logged in."})
    }
    const group = await Group.findByPk(groupId)
    if(!group){
      res.statusCode = 404
      return res.json({
        message: "Couldn't find group",
        statusCode: 404
      })
    }

    //Need to add permission for co-host once memberships have been created.
    if(group.organizerId !== user.toSafeObject().id){
      res.statusCode = 403
      return res.json({
        message: "You must be an organizer or co-host to create events.",
        statusCode: 403
      })
    }
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
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

    return res.json(newEvent);
  }
);

router.post(
  '/',
  validateCreation,
  restoreUser,
  async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body
    const { user } = req
    const organizerId = user.id
    const newGroup = await Group.create({ organizerId, name, about, type, private, city, state})
    return res.json(newGroup);
  }
);

router.put(
  '/:groupId/membership',
  restoreUser,
  async (req, res, next) => {
    const {groupId} = req.params
    const { user } = req;
    const { memberId, status } = req.body
    if (!user) {
      return res.json({"Message": "Not logged in."})
    }
    const group = await Group.findByPk(groupId, {include: [{model: Membership }]})

    if(group.organizerId !== user.id){
      res.statusCode = 403
      return res.json({
        message: "You must be an organizer or co-host to create events.",
        statusCode: 403
      })
    }
    if(!group){
      res.statusCode = 404
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }

    const newUser = await User.findByPk(memberId)

    if(!newUser){
      res.statusCode = 400
      return res.json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
          "memberId": "User couldn't be found"
        }
      })
    }

    const [membership] = group.Memberships.filter(member => member.userId === memberId)

    if(!membership){
      res.statusCode = 404
      return res.json({
        message: "Membership between the user and the group does not exits",
        statusCode: 404
      })
    }

    if(status.toLowerCase() === "pending"){
      res.statusCode = 404
      return res.json({
        message: "Cannot change a membership status to pending",
        statusCode: 404
      })
    }

    if(!['member', 'co-host'].includes(status.toLowerCase())){
      res.statusCode = 404
      return res.json({
        message: "Not a valid membership status",
        statusCode: 404
      })
    }

    membership.status = status

    return res.json(membership)
  });

router.post(
  '/:groupId/membership',
  restoreUser,
  async (req, res, next) => {
    const {groupId} = req.params
    const { user } = req;
    if (!user) {
      return res.json({"Message": "Not logged in."})
    }
    const userId = user.id
    const group = await Group.findByPk(groupId, {include: [{model: Membership}]})
    if(!group){
      res.statusCode = 404
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }

    if(group.Memberships.length > 0){
      const message = group.Memberships[0].status === 'pending' ?
      "Membership has already been requested" :
      "User is already a member of the group"
      res.statusCode = 400

      return res.json({
        message,
        statusCode: res.statusCode
      })
    }

    const newMember = await Membership.create({
      groupId,
      userId,
      status: "pending"
    })
    return res.json({
      groupId,
      userId,
      status: "pending"
    })
  }
)

router.get(
  '/:groupId/members',
  async (req, res, next) => {
    const { groupId } = req.params

    const userIsHost = false;  //needs updated for organizers and cohosts
    let members
    if(userIsHost){
      members = await Membership.findAll({where: {groupId}})
    }
    else{
      members = await Membership.findAll({where: {groupId, status: {[Op.in] : ["co-host", "member"]}}})
    }

    if(members.length < 1){
      res.statusCode = 404
      return res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }

    return res.json({
      Members: members
    });
  }
);


module.exports = router;
