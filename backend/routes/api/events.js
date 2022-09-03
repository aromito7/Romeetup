// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Event } = require('../../db/models');
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

    const events = await Event.findAll({});

    return res.json({
      events
    });
  });


  module.exports = router;
