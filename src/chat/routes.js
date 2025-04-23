const route = require('express').Router();
const chatControl = require("./control");
const chatValidate = require("./validate");
const { verifyToken } = require('../../libs/token');

route.post('/ws/chat', verifyToken, chatValidate.chat, chatControl.chat);
route.post('/ws/test', verifyToken, chatValidate.chat, chatControl.test);

module.exports = route