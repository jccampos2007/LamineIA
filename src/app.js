const path = require("path");
const express = require('express')
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
require('dotenv').config();
const { trim_all } = require('request_trimmer');

// middlewares 
app.use(morgan('tiny'));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(trim_all);
app.use('/preview', express.static(path.join(__dirname, 'preview')))
app.use(require('./index/routes.js'));
app.use(require('./auth/routes.js'));
app.use(require('./chat/routes.js'));
app.use(require('./user/routes.js'));
app.use(require('./subscribers/routes.js'));
app.use(require('./paymenttype/routes.js'));
app.use(require('./paymentdetails/routes.js'));
////////////////////////////////////////////

// api-doc
const swaggerDocument = YAML.load(`${path.join(__dirname, 'swagger.yaml')}`);
app.use('/ws/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
///////////////////////////////////////////////

app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

app.use(errorMiddleware);

class HttpException extends Error {
    constructor(status, message, data) {
        super(message);
        this.code = status;
        this.message = message;
        this.data = data;
    }
}

function errorMiddleware(error, req, res, next) {
    let { code = 500, message, data } = error;

    console.log(`[Error] ${error}`);

    // If status code is 500 - change the message to Intrnal server error
    message = code === 500 || !message ? 'Internal server error' : message;

    error = {
        type: 'error',
        code,
        message,
        ...(data) && data
    }

    res.status(code).send(error);
}


module.exports = app