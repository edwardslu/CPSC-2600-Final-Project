const utils = require(`${__dirname}/../server/utils`);
const config = require(`${__dirname}/../server/config/config`);
const express = require('express');
const homeController = express();
const path = require('node:path'); 

let clientPath = config.ROOT;

homeController.use(express.static(`${clientPath}`));

homeController.get('/views/index.html', (request, response) => {
    utils.logRequest(request);
    response.sendFile(path.join(clientPath, "index.html"));
});

homeController.get('/views/css/style.css', (request, response) => {
    utils.logRequest(request);
    response.sendFile(path.join(clientPath, "css/style.css"));
});

homeController.get('/views/css/litera.min.css', (request, response) => {
    utils.logRequest(request);
    response.sendFile(path.join(clientPath, "css/litera.min.css"));
});

homeController.get('/views/img/question.svg', (request, response) => {
    utils.logRequest(request);
    response.sendFile(path.join(clientPath, "img/question.svg"));
});

homeController.get('/views/img/person.svg', (request, response) => {
    utils.logRequest(request);
    response.sendFile(path.join(clientPath, "img/person.svg"));
});

homeController.get('/views/js/bootstrap.bundle.min.js', (request, response) => {
    utils.logRequest(request);
    response.sendFile(path.join(clientPath, "js/bootstrap.bundle.min.js"));
});

homeController.get('/views/js/script.js', (request, response) => {
    utils.logRequest(request);
    response.sendFile(path.join(clientPath, "js/script.js"));
});

module.exports = homeController;