'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const App = express();

// const Clases = require('./routes/clasesRoutes');
// const Aulas = require('./routes/aulasRoutes');
// const Catedraticos = require('./routes/catedraticosRoutes');
// const Fichas = require('./routes/fichasRoutes');
const Sheet = require('./routes/sheetsRoutes');
const Usuarios = require('./routes/usuariosRoutes');
// const Facultades = require('./routes/facultadesRoutes');

App.use(express.json());
App.use(express.urlencoded({ extended: false }));

// App.use('/api/clases', Clases);
// App.use('/api/aulas', Aulas);
// App.use('/api/catedraticos', Catedraticos);
// App.use('/api/fichas', Fichas);
App.use('/api/sheets', Sheet);
App.use('/api/usuarios', Usuarios);
// App.use('/api/facultades', Facultades);

module.exports = App;