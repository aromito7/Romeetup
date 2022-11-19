// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth, restoreUser, isAuthorized, notAuthorized, groupNotFound } = require('../../utils/auth');
const { Group, Venue, Event, Membership, User, GroupImage, Attendance} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const venue = require('../../db/models/venue');
const { Op } = require('sequelize');
const { execSync } = require('child_process');
const user = require('../../db/models/user');
const { query } = require('express');

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

// const isAuthorized = (currentUser, group, memberships) => {
//   // console.log([
//   //   {currentUser: currentUser},
//   //   group,
//   //   memberships
//   // ])
//   if(memberships){  //Needs to be tested on code with memberships
//     const currentUserMemberships = memberships.filter( m => m.userId === currentUser.id)
//     console.log(memberships, currentUserMemberships)
//     if(currentUserMemberships[0].status.match(/^co-host$/i)){
//       return true
//     }
//   }

//   if(currentUser.id === group.organizerId){
//     return true
//   }

//   return false
// }

// const notAuthorized = res => {
//   res.statusCode = 403
//   res.message = "Forbidden"
//   return res.json({
//     message: "Forbidden",
//     statusCode: 403
//   })
// }

// const groupNotFound = res => {
//   res.statusCode = 404
//   res.message = "Group couldn't be found"
//   return res.json({
//     message: "Group couldn't be found",
//     statusCode: 404
//   })
// }

router.get(
  '/',
  async (req, res) => {
    const query = {}
    query.include = [
      {model: User}]//, attributes: ["id", "firstName", "city", "state"]}]
    const groups = await Group.findAll(query);
    return res.json(groups);
  }
);

router.get(
  '/current',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
  const { user } = req
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
    query.include = [
      {model: User}]
    const groups = await Group.findByPk(groupId, query)
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
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { groupId } = req.params;
    const { name, about, type, private, city, state } = req.body
    const fields = {name, about, type, private, city, state}
    const { user } = req
    const group = await Group.findByPk(groupId);

    if(group){
      if(isAuthorized(user, group)){
        for(i in fields){
          if(fields[i] !== undefined)
            group[i] = fields[i]
        }

        group.save()
        const{ id, organizerId, name, about, type, private, city, state, createdAt, updatedAt } = group
        return res.json({
          id,
          organizerId,
          name,
          about,
          type,
          private,
          city,
          state,
          createdAt,
          updatedAt
        })
      }
      else{
        return notAuthorized(res)
      }
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
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    const { user } = req
    if(group){
      if(isAuthorized(user, group)){
        group.destroy()
        res.json({
          message: "Successfully deleted",
          statusCode: 200
        })
      }
      else{
        return notAuthorized(res)
      }
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
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { groupId } = req.params;
    const { url, preview } = req.body;
    const { user } = req;

    // return res.json({groupId, url, preview})
    const group = await Group.findByPk(groupId);
    if(group){
      if(isAuthorized(user, group))
      {
        if(preview){
          group.previewImage = url
        }
        group.save()
        const groupId = group.id
        const groupImage = await GroupImage.create({
          groupId,
          url,
          preview
        })
        return res.json({
          id: groupImage.id,
          url,
          preview
        });
      }
      else{
        return notAuthorized(res)
      }
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
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { groupId } = req.params
    const { address, city, state, lat, lng } = req.body
    const { user } = req
    const group = await Group.findByPk(groupId)
    if(!group){
      return groupNotFound(res)
    }
    const memberships = await Membership.findAll({where: {groupId}})
    if(!isAuthorized(user, group, memberships)){
      return notAuthorized(res)
    }
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
  }
);

router.get(
  '/:groupId/venues',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { groupId } = req.params
    const { user } = req
    const group  = await Group.findByPk(groupId)

    if(!group){
      return groupNotFound(res)
    }

    const venue = await Venue.findAll({ where : {groupId}})
    const memberships = await Membership.findAll({ where: {groupId}})
    if(isAuthorized(user, group, memberships)){
      return res.json({
        Venues: venue
      });
    }
    else{
      return notAuthorized(res)
    }
  }
);

router.get(
  '/:groupId/events',
  async (req, res, next) => {
    const { groupId } = req.params
    const query = {where: {groupId}}
    query.include = [
      {model: Group, attributes: ["id", "name", "city", "state"]},
      {model: Venue, attributes: ["id", "city", "state"]}]
    const events = await Event.findAll(query)
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
  restoreUser,
  requireAuth,
  validateEvent,            //For postman test to create event by invalid groupId is it ok if validator checks for errors before my code checks URL params?
  async (req, res, next) => {
    const { user } = req;
    const { groupId } = req.params
    const group = await Group.findByPk(groupId)
    if(!group){
      return groupNotFound(res)
    }

    const memberships = await Membership.findAll({where: {groupId}})

    //Need to add permission for co-host once memberships have been created.
    if(!isAuthorized(user, group, memberships)){
      return notAuthorized(res)
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
    const {id} = newEvent
    await Attendance.create({
      eventId: id,
      userId: user.id,
      status: "attending"
    })
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
    });
  }
);


router.post(
  '/',
  validateCreation,
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body
    const { user } = req
    const organizerId = user.id
    const newGroup = await Group.create({ organizerId, name, about, type, private, city, state})

    // const newMember = await Membership.create({  // I originally thought that organizers needed to be in the members list but the requirements state otherwise.
    //   userId: user.id,
    //   groupId: newGroup.id,
    //   status: "co-host"
    // })
    return res.json({
      id: newGroup.id,
      name,
      about,
      type,
      private,
      city,
      state
    });
  }
);

router.delete(
  '/:groupId/membership',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const {groupId} = req.params
    const { user } = req;
    const { memberId, status } = req.body

    const group = await Group.findByPk(groupId, {include: [{model: Membership }]})

    if(!group){
      return groupNotFound(res)
    }
    if(!(group.organizerId === user.id || memberId === user.id)){
      return notAuthorized(res)
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

    membership.destroy()

    return res.json({
      message: "Successfully deleted membership from group"
    })
  });


router.put(
  '/:groupId/membership',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const {groupId} = req.params
    const { user } = req;
    const { memberId, status } = req.body

    const member = await User.findByPk(memberId)

    if(!member){
      res.statusCode = 400
      return res.json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
          "memberId": "User couldn't be found"
        }
      })
    }

    const group = await Group.findByPk(groupId, {include: [{model: Membership }]})

    if(!group){
      return groupNotFound(res)
    }

    if(!isAuthorized(user, group, group.Memberships)){
      return notAuthorized(res)
    }


    const [membership] = group.Memberships.filter(member => member.userId === memberId)
    //return res.json([membership, group.Memberships])
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

    if(!status.match(/^(member|co-host)$/i)){//!['member', 'co-host'].includes(status.toLowerCase())){
      res.statusCode = 404
      return res.json({
        message: "Not a valid membership status",
        statusCode: 404
      })
    }

    if(status.toLowerCase() === "co-host" && group.organizerId !== user.id){
      res.statusCode = 403
      return res.json({
        message: "Only the organizer can promote to co-host",
        statusCode: 403
      })
    }

    membership.status = status
    membership.save()

    return res.json(membership)
  });

router.post(
  '/:groupId/membership',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const {groupId} = req.params
    const { user } = req;
    const userId = user.id
    const group = await Group.findByPk(groupId, {include: [{model: Membership}]})
    if(!group){
      return groupNotFound(res)
    }
    const member = group.Memberships.filter( m => m.userId === user.id)
    if(member.length > 0){
      const message = member[0].status === 'pending' ?
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
  restoreUser,
  async (req, res, next) => {
    const { groupId } = req.params
    const { user } = req
    const group = await Group.findByPk(groupId)


    members = await Membership.findAll({where: {groupId}})



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
