const route = require('express').Router();
const control = require("./control"); 
const validate = require("./validate");
const {verifyToken} = require('../../libs/token'); 

route.get('/ws/paymethod', verifyToken, validate.getOne, control.getOne);

route.get('/ws/paymethod/list', verifyToken, control.getAll);

route.post('/ws/paymethod', verifyToken, validate.add, control.add);

route.put('/ws/paymethod', verifyToken, validate.update, control.update);

route.delete('/ws/paymethod', verifyToken, validate.delete, control.deleted);

module.exports = route 