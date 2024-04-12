const utils = require(`${__dirname}/../server/utils`);
const config = require(`${__dirname}/../server/config/config`);
const express = require('express');
const bodyParser = require('body-parser');
const memberController = express();
const path = require('node:path');

let clientPath = config.ROOT;

memberController.use(express.static(`${clientPath}`));
memberController.use(bodyParser.json());

let members = [];
let authenticated = [];



memberController.post('/signup', async (request, response) => {
    // console.log(JSON.stringify(request.body));
    const {email, password} = request.body;
    console.log(email + ", " + password);
    response.status(200).json({
        success: {
            email: email, 
            message: `${email} was added successfuly to members.` 
        }
    });
});

memberController.post('/signout', (request, response) => {
    console.log('inside /signout')
    const email = request.body.email;
    console.log("authenticated", authenticated)
    authenticated.splice(authenticated.indexOf(email), 1)
    console.log("authenticated", authenticated)
    response.status(200).json({
        success: {
            email: email,
            message: `${email} logout successfully.`,
        },
    });
});

module.exports = memberController;