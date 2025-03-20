const route = require('express').Router();
const control = require("./control"); 
const validate = require("./validate");
const {verifyToken} = require('../../libs/token'); 

route.get('/ws/user', verifyToken, validate.getOne, control.getOne);

route.get('/ws/user/list', verifyToken, control.getAll);

route.post('/ws/user', verifyToken, validate.add, control.add);

route.put('/ws/user', verifyToken, validate.update, control.update);

route.delete('/ws/user', verifyToken, validate.delete, control.deleted);

module.exports = route