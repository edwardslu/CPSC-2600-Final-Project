const express = require("express");

const utils = require(`${__dirname}/utils`);
const config = require(`${__dirname}/config/config`);
const homeController = require(`${__dirname}/../controllers/homeController`);

const app = express();
const port = config.PORT;
const clientPath = config.ROOT;
const path = require('node:path'); 

app.get('/test', (request, response) => {
    response.sendStatus(200);
})

app.use(homeController);

app.listen(port, '127.0.0.1', () => {
    console.log(`Server is running on port ${port}`);
});