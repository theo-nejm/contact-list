const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');

// Rotas da home
route.get('/', homeController.index);

module.exports = route;
