
const route = require('express').Router();
const IndexControl = require("./control");
const countryValidate = require('./validate');

route.get('/', IndexControl.index);

route.get('/ws', IndexControl.index);

route.get('/ws/documentation', IndexControl.documentation);
 

module.exports = route