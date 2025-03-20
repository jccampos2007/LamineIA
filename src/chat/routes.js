const route = require('express').Router();
const chatControl = require("./control");
const chatValidate = require("./validate"); 
const {verifyToken} = require('../../libs/token'); 

route.post('/ws/chat', chatValidate.chat, chatControl.chat);

module.exports = route