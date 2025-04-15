const route = require('express').Router();
const control = require("./control"); 
const validate = require("./validate");
const {verifyToken} = require('../../libs/token'); 

route.get('/ws/paymentdetails', verifyToken, validate.getOne, control.getOne);

route.get('/ws/paymentdetails/list', verifyToken, control.getAll);

route.post('/ws/paymentdetails', verifyToken, validate.add, control.add);

route.put('/ws/paymentdetails', verifyToken, validate.update, control.update);

route.put('/ws/paymentdetails/confirm', verifyToken, validate.confirm, control.confirm);

route.delete('/ws/paymentdetails', verifyToken, validate.delete, control.deleted);


module.exports = route