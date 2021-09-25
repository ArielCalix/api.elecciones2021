'use strict'

const mongoose = require('mongoose');
const CONFIG = require('./config');

module.exports = {
    connection: null,
    connect: function () {
        if (this.connection) return this.connection;
        return mongoose.connect(CONFIG.DB, CONFIG.DB_OPTIONS).then(connection => {
            this.connection = connection;
            console.log('Conection to DB is OK');
        }).catch(error => console.error(error));
    }
}