const utils = require(`${__dirname}/../server/utils`);
const config = require(`${__dirname}/../server/config/config`);
const express = require('express');
const memberController = express();
const path = require('node:path'); 

let clientPath = config.ROOT;

memberController.use(express.static(`${clientPath}`));

memberController.post()