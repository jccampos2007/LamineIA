const route = require('express').Router();
const chatControl = require("./control");
const chatValidate = require("./validate");
const { verifyToken } = require('../../libs/token');

route.post('/ws/chat', verifyToken, chatValidate.chat, chatControl.chat);

module.exports = route