'use strict'
const bcrypt = require('bcrypt')
let mongoose = require('mongoose');

let usuarioSchema = mongoose.Schema({
    idUsuario: {
        type: String,
        autoIndex: true,
        required: true,
        unique: true
    },
    nombreUsuario: {
        type: String,
        required: true,
    },
    passUsuario: {
        type: String,
        required: true
    },
    fechaLogueo: {
        type: Date, default: Date.now()
    },
    ultimoLogueo: Date,
    estadoUsuario: Boolean
});

usuarioSchema.pre('save', function (next) {
    bcrypt.genSalt(10).then(salts => {
        bcrypt.hash(this.passUsuario, salts).then(hash => {
            this.passUsuario = hash;
            next();
        }).catch(error => next(error));
    }).catch(error => next(error));
});

usuarioSchema.method('comparePass', function (password) {
    return bcrypt.compareSync(password, this.passUsuario);
});

module.exports = mongoose.model('usuario', usuarioSchema);