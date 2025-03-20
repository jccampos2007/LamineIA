const route = require('express').Router();
const LoginControl = require("./control");
const loginValidate = require("./validate");

route.post('/ws/auth/login', loginValidate.login, LoginControl.login);

module.exports = route