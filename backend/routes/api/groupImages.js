// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { GroupImage, Group, Membership } = require('../../db/models');
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

    const groupImages = await GroupImage.findAll({});

    return res.json({
      groupImages
    });
  });

router.delete(
  '/:imageId',
  restoreUser,
  async (req, res, next) => {
    const { imageId } = req.params
    const { user } = req

    const groupImage = await GroupImage.findByPk(imageId, {include: Group})
    if(!groupImage){
      res.statusCode = 404
      return res.json({
        "message": "Group Image couldn't be found",
        "statusCode": 404
      })
    }

    const group = await Group.findByPk(groupImage.Group.id, {include: Membership})

    const membership = await Membership.findAll({where: {userId: user.id, groupId: group.id}})
    if(membership[0] && (groupImage.Group.organizerId === user.id || membership[0].status.toLowerCase() === "co-host")){
      await groupImage.destroy()
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
