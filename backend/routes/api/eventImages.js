// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { EventImage, Group, Membership, Event } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in
router.get(
  '/',
  async (req, res, next) => {

    const EventImages = await EventImage.findAll({});

    return res.json({
      EventImages
    });
  });

router.delete(
  '/:imageId',
  restoreUser,
  async (req, res, next) => {
    const { imageId } = req.params
    const { user } = req

    const eventImage = await EventImage.findByPk(imageId, {include: {model: Event, include: Group}})
    if(!eventImage){
      res.statusCode = 404
      return res.json({
        "message": "Event Image couldn't be found",
        "statusCode": 404
      })
    }
    //return res.json(eventImage)
    const event = eventImage.Event
    const group = event.Group

    const membership = await Membership.findAll({where: {userId: user.id, groupId: group.id}})
    if(membership[0] && (group.organizerId === user.id || membership[0].status.toLowerCase() === "co-host")){
      await eventImage.destroy()
      return res.json({
        message: "Successfully deleted"
      })
    }
    res.statusCode = 403
    return res.json({
      message: "You don't have permission to delete images",
      statusCode: 403
    })
  }
)

  module.exports = router;
