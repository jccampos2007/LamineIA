const route = require('express').Router();
const LoginControl = require("./control"); 
const loginValidate = require("./validate");
const {verifyToken} = require('../../libs/token'); 

route.get('/ws/auth/sendotp', loginValidate.sendOtp, LoginControl.sendOtp);

route.post('/ws/auth/login', loginValidate.login, LoginControl.login);

route.put('/ws/auth/logout', verifyToken, LoginControl.logout);

module.exports = route