// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


router.get(
  '/',
  async (req, res) => {
    const groups = await Group.findAll({});
    return res.json({
      groups
    });
  }
);



module.exports = router;
