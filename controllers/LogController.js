// const utils = require(`${__dirname}/../server/utils`);
// const config = require(`${__dirname}/../server/config/config`);
// const user = require(`${__dirname}/../model/user`);
// const util = require(`${__dirname}/../model/util`);
// const mongoClient = require('mongodb');
// const mongodbClient = util.getMongoClient();
// const express = require('express');
// const bodyParser = require('body-parser');
// const logController = express();
// const bcrypt = require('bcrypt');
// const path = require('node:path');
// const log = require(`${__dirname}/../model/log`);

// let clientPath = config.ROOT;





// logController.use(express.static(`${clientPath}`));
// logController.use(bodyParser.json());

// logController.post('/log', (request, response) => {
//     let collection = mongodbClient.db().collection('Log');
//     try {
//         const {date, url, method} = request.body;
//         const log = log(date, url, method);
//         util.insertOne(collection, log);
//         response.status(200).json({ message: 'Log entry saved successfully' });
//     } catch (error) {
//         console.error('Error saving log entry:', error);
//         response.status(500).json({ error: 'Internal server error'});
//     }
// });

// module.exports = logController;