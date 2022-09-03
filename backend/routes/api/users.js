// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('lastName')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];


router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });
    const token = await setTokenCookie(res, user);
    const {id} = user
    return res.json({
      id,
      firstName,
      lastName,
      email,
      token
    });
  }
);


router.get(
  '/',
  async (req, res, next) => {

    const users = await User.findAll({});

    return res.json({
      users
    });
  });


module.exports = router;
