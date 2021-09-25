'use strict'

const express = require('express');
const usuarioController = require('../controllers/usuariosController');
const auth = require('../middlewares/auth')
const apiRoutes = express.Router();

apiRoutes.get('/get', auth.isAuth, async (req, res) => await usuarioController.getUsuarios(req, res))
    .get('/getBy/:key/:value', auth.isAuth, async (req, res) => await usuarioController.getUsuarioById(req, res))
    .get('/whoAmI', auth.whoAmI, async (req, res) => await usuarioController.getUserInfo(req, res))
    .put('/update/:key/:value', auth.isAuth, usuarioController.find,
        async (req, res) => await usuarioController.updateUsuario(req, res))
    .delete('/delete/:key/:value', auth.isAuth, usuarioController.find,
        async (req, res) => await usuarioController.deleteUsuario(req, res))
    .post('/login', async (req, res) => await usuarioController.signIn(req, res))
    .post('/registro', async (req, res) => await usuarioController.signUp(req, res));

module.exports = apiRoutes;