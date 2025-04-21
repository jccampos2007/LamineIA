const route = require('express').Router();
const control = require("./control"); 
const validate = require("./validate");
const {verifyToken} = require('../../libs/token'); 

route.get('/ws/loghistory', verifyToken, validate.getOne, control.getOne);

route.get('/ws/loghistory/list', verifyToken, control.getAll);

route.post('/ws/loghistory', verifyToken, validate.add, control.add);

route.put('/ws/loghistory', verifyToken, validate.update, control.update);

route.delete('/ws/loghistory', verifyToken, validate.delete, control.deleted);

module.exports = route