'use strict'

const express = require('express');
const sheetController = require('../controllers/sheetsController');
const auth = require('../middlewares/auth')
const apiRoutes = express.Router();

apiRoutes.get('/get', auth.isAuth, async (req, res) => await sheetController.getData(req, res))
    .post('/insert', auth.isAuth, async (req, res) => await sheetController.insertData(req, res));

module.exports = apiRoutes;