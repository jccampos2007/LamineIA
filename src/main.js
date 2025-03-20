const https = require('https');
const fs = require('fs');
const { dbconn } = require('../libs/db');
const cfg = require('../libs/env');
const app = require('./app');

/////////////////////////////////// 
const { startServerSocket } = require("../libs/socket");


async function runServer() {
    try {
        dbconn.connect();
        console.log('Connection has been established successfully.');
        /////////////////////////////////////////////////////////////
        var myserver = null;
        if (cfg.ENVIRONMENT == 'dev') {
            myserver = app.listen(cfg.PORT, function () {
                console.log(`Servidor web escuchando en el puerto DEV : ${cfg.PORT}`);
            });
        }
        ////////////////////////////////////
        if (cfg.ENVIRONMENT == 'prod') {
            const options = {
                key: fs.readFileSync(cfg.CERTIFICATE_KEY),
                cert: fs.readFileSync(cfg.CERTIFICATE_CRT)
            };
            console.log(`Servidor https corriendo en puerto PROD ${cfg.PORT}`);
            myserver = https.createServer(options, app, function (req, res) {
                console.log('Servidor https corriendo en puerto ' + cfg.PORT);
            }).listen(cfg.PORT);
        }
        ////////////////////////////////////    
        startServerSocket(myserver);

    } catch (error) {
        console.log(error);
    }
}

runServer();
