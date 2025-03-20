const { validationResult } = require('express-validator');
const chatModel = require('./model');


async function chat(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ code: 400, message: 'Validation Errors', errors: errors.array() });
    let out = await chatModel.chat(req.body, req);
    res.status(out.code).json(out);    
}

module.exports = {
    chat
}