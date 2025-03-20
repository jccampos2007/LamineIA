const route = require('express').Router();
const control = require("./control"); 
const validate = require("./validate");
const {verifyToken} = require('../../libs/token'); 

route.get('/ws/subscribers', verifyToken, validate.getOne, control.getOne);

route.get('/ws/subscribers/list', verifyToken, control.getAll);

route.post('/ws/subscribers', verifyToken, validate.add, control.add);

route.delete('/ws/subscribers', verifyToken, validate.delete, control.deleted);

module.exports = route