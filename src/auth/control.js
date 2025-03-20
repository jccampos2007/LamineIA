const { validationResult } = require('express-validator');
const loginModel = require('./model');

async function login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ code: 400, message: 'Validation Errors', errors: errors.array() });
    let out = await loginModel.login(req.body);
    let obj = out[0];
    let token = out[1];
    res.header('token', token).status(obj.code).json(obj);
}

module.exports = {
    login
}
