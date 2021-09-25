'use strict'
const services = require('../services/services')
const moment = require('moment')

function isAuth(request, response, next) {
    if (!request.headers.authorization) return response.status(403).send({ message: 'Not authorized' });
    const token = request.headers.authorization.split(' ')[1];
    services.decodeToken(token)
        .then(res => {
            request.user = res;
            next();
        })
        .catch(res => {
            response.status(res.status);
        });
}

function whoAmI(request, response, next) {
    if (!request.headers.authorization) return response.status(403).send({ message: 'Authorization header not found' });
    var token = request.headers.authorization.split(' ')[1];
    services.decodeToken(token)
        .then(res => {
            request.body.idUsuario = res;
            next();
        }
        ).catch(res => {
            response.status(res.status);
        });
}

module.exports = { isAuth, whoAmI };