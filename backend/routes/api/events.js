// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Event } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


router.get(
  '/',
  async (req, res, next) => {

    const events = await Event.findAll({});

    return res.json({
      events
    });
  });

  router.get(
    '/:eventId',
    async (req, res) => {
      const { eventId } = req.params;
      const event = await Event.findByPk(eventId, {include: ["Venue", "Group", "EventImages"]})
      if(event){
        return res.json({
          event
        });
      }else{
        res.statusCode = 404
        return res.json({
          message: "Event couldn't be found",
          statusCode: 404
        })
      }
    }
  );


  module.exports = router;
