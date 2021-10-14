'use strict'

const express = require('express');
const sheetController = require('../controllers/sheetsController');
const auth = require('../middlewares/auth')
const apiRoutes = express.Router();

apiRoutes.get('/get/:key/:value', auth.isAuth, async (req, res) => await sheetController.getData(req, res))
    .post('/insert/:key/:value', auth.isAuth, async (req, res) => await sheetController.insertData(req, res));

module.exports = apiRoutes;