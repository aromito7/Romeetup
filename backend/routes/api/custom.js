// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Venue, Event, Membership, User } = require('../../db/models');
const { Op } = require('sequelize');
const { execSync } = require('child_process')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateCustomTableCreation = [
    check('name')
      .exists({ checkFalsy: true })
      .custom((name) => name.match(/^[a-zA-z]*$/))
      .withMessage('Name must be a word with only letters'),

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
    //execSync("pwd", { encoding: 'utf-8'});
    const output = {}

    output.message = "This is my custom router for my meetup project, and below are a list of commands that I'm working on."
    output.createTable = {
        url: "/custom/create/:name",
        method: "POST",
        description: "Will create a new table in database and route",
        status: "In progress"
    }


    return res.json(output)
  }
);

router.post(
    '/create/:name',
    async (req, res) => {
        //execSync("pwd", { encoding: 'utf-8'});
        const {name} = req.params
        const columns = req.body

        const validTypes = ['integer', 'boolean', 'string', 'date']

        let params = []

        for(key of Object.keys(columns)){
            console.log(key)
            columns[key] = columns[key].toLowerCase()
            if(!validTypes.includes(columns[key])){
                return res.json({
                    message: "Valid types are integer, boolean, string, and date.",
                    statusCode: 401
                })
            }
            params.push(`${key}:${columns[key]}`)
        }

        params = params.join(",")

        let command = "npx sequelize model:generate --name " + name + " --attributes " + params

        execSync(command);

        return res.json({
            message: `${name} migration and model successfully created`
        })
    }
  );

module.exports = router;
