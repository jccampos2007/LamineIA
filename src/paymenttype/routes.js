const route = require('express').Router();
const control = require("./control"); 
const validate = require("./validate");
const {verifyToken} = require('../../libs/token'); 

route.get('/ws/paymenttype', verifyToken, validate.getOne, control.getOne);

route.get('/ws/paymenttype/list', verifyToken, control.getAll);

route.post('/ws/paymenttype', verifyToken, validate.add, control.add);

route.put('/ws/paymenttype', verifyToken, validate.update, control.update);

route.delete('/ws/paymenttype', verifyToken, validate.delete, control.deleted);

module.exports = route