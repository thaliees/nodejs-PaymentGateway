'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const swagger = require('swagger-ui-express');
const docs = require('./openapi.json');
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type Authorization Content-Length X-Request-Width');
    
    if('OPTIONS' === req.method) { res.send(200); }
    else { next(); }
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(allowCrossDomain);

/* --- IMPORT ROUTES --- */
const payment = require('./Routes/PaymentGatewayRouter');

/* --- LOAD ROUTES --- */
app.use('/api/', payment);

/* --- SWAGGER { OPENAPI } --- */
app.use('/api/api-docs', swagger.serve, swagger.setup(docs));

module.exports = app;