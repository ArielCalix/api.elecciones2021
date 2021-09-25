'use strict'

const Usuario = require('../models/usuarioModel');
const service = require('../services/services');

function getUsuarios(request, response) {
    Usuario.find({})
        .then(usuarios => {
            if (usuarios.length) return response.status(200).send({ usuarios });
            return response.status(204).send({ Message: 'Empty' })
        })
        .catch(error => response.status(500).send({ error }));
}

function getUsuarioById(request, response) {
    let searchParam = {};
    searchParam[request.params.key] = { $regex: request.params.value, $options: 'i' };
    Usuario.find(searchParam)
        .then(usuarios => {
            if (usuarios.length === 0) return response.status(404).send({ Message: 'Not Found' });
            return response.status(200).send({ usuarios });
        })
        .catch(error => {
            return response.status(500).send({ error });
        })

}

function insertUsuario(request, response) {
    new Usuario(request.body).save()
        .then(usuario => response.status(201).send({ usuario }))
        .catch(error => response.status(500).send({ error }));
}

function updateUsuario(request, response) {
    if (request.body.error) return response.status(500).send({ error });
    if (!request.body.usuarios) return response.status(404).send({ Message: 'Not Found' });
    let usuario = request.body.usuarios[0];
    usuario = Object.assign(usuario, request.body);
    Usuario(usuario).save()
        .then(usuario => response.status(200).send({ message: 'Updated', usuario }))
        .catch(error => response.status(500).send({ error }));
}

function deleteUsuario(request, response) {
    if (request.body.error) return response.status(500).send({ error });
    if (!request.body.usuarios) return response.status(404).send({ Message: 'Not Found' });
    request.body.usuarios[0].remove()
        .then(usuario => response.status(200).send({ message: 'Removed', usuario }))
        .catch(error => response.status(500).send({ error }));
}

function find(request, response, next) {
    let query = {};
    query[request.params.key] = request.params.value;
    Usuario.find(query)
        .then(usuarios => {
            if (!usuarios) return next();
            request.body.usuarios = usuarios;
            return next();
        })
        .catch(error => {
            request.body.error = error;
            return next();
        });
}

function signUp(request, response) {
    const user = new Usuario({
        idUsuario: request.body.idUsuario,
        nombreUsuario: request.body.nombreUsuario,
        passUsuario: request.body.passUsuario,
        estadoUsuario: request.body.estadoUsuario
    });
    user.save((err) => {
        if (err) return response.status(500).send({ message: `Can´t create the user: ${err}` });
        return response.status(201).send({ token: service.createToken(user) });
    })
}

function signIn(request, response) {
    Usuario.findOne({ idUsuario: request.body.idUsuario }, (err, user) => {
        if (err) return response.status(500).send({ message: err });
        if (!user) return response.status(404).send({ message: 'Not found' });
        const passwordCorrect = user.comparePass(request.body.passUsuario);
        if (passwordCorrect) {
            request.user = user;
            response.status(200).send({
                message: 'Logged in',
                nombreUsuario: user.nombreUsuario,
                token: service.createToken(user)
            });
        } else response.status(401).send({ message: 'incorrect user or password' });

    })
}

function getUserInfo(request, response) {
    Usuario.findOne({ idUsuario: request.body.idUsuario }, (err, user) => {
        if (err) return response.status(500).send({ message: err });
        if (!user) return response.status(404).send({ message: 'Not found' });
        request.user = user;
        response.status(200).send({
            message: 'Logged in',
            nombreUsuario: user.nombreUsuario
        });

    })
}

module.exports = {
    insertUsuario,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    find,
    signUp,
    signIn,
    getUserInfo
}