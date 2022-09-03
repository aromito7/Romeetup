// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { EventImage } = require('../../db/models');
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


  module.exports = router;
