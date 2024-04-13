const utils = require(`${__dirname}/../server/utils`);
const config = require(`${__dirname}/../server/config/config`);
const user = require(`${__dirname}/../model/user`);
const util = require(`${__dirname}/../model/util`);
const mongoClient = require('mongodb');
const mongodbClient = util.getMongoClient();
const express = require('express');
const bodyParser = require('body-parser');
const memberController = express();
const bcrypt = require('bcrypt');
const path = require('node:path');

let clientPath = config.ROOT;





memberController.use(express.static(`${clientPath}`));
memberController.use(bodyParser.json());

let members = [];
let authenticated = [];

memberController.post('/signup', async (request, response) => {
    console.log("URI: " + util.getUri);
    console.log("db: " + mongodbClient);
    console.log(typeof(mongodbClient));
    let collection = mongodbClient.db().collection('Members');
    members = await util.find(collection, {})
    console.log('MongoDB Members', members);

    const {email, password} = request.body;
    let hashed = await bcrypt.hash(password, config.SALT_ROUNDS);
    console.log(email + ", " + `${hashed}`);
    const member = user(email, hashed);

    if (members.length === 0)
        members = utils.readJson(config.MEMBERS);
    
    const isMember = members.filter((m) => m.email === email)[0];
    if (!isMember) {
        members.push(member);
        console.info(members);
        authenticated.push(email);
        util.insertOne(collection, members[members.length - 1]);
        utils.saveJson(config.MEMBERS, JSON.stringify(members));
        response.status(200).json({
            success: {
                email: email, 
                message: `${email} was added successfuly to members.` 
            }
        });
    }
    else {
        response
        .status(200)
        .json({ error: `${email} already exists. Please enter a different email.`})
    }
    utils.logRequest(request);
    util.logRequest(request, response);
});

memberController.post('/signin', async (request, response) => {
    let collection = mongodbClient.db().collection('Members');
    members = await util.find(collection, {})
    console.info(`\t|Inside app.post('/signin')`)
    const { email, password } = request.body
    if (members.length === 0)
        members = utils.readJson(config.MEMBERS)
    console.log(members)
    const error = {
        email: email,
        error: `Email or password is incorrect.`,
    }
    const member = members.filter((m) => m.email === email)[0]

    if (!member) {
        response
            .status(200)
            .json(error)
    } else {
        const isMatched = await bcrypt.compare(password, member.hashedPassword);
        if (!isMatched) {
            response
                .status(200)
                .json(error)
        } else {
            response
                .status(200)
                .json({ success: `${email} logged in successfully!` })
            authenticated.push(email)
        }
    }
    utils.logRequest(request);
    util.logRequest(request, response);
})


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
    utils.logRequest(request);
    util.logRequest(request, response);
});

module.exports = memberController;