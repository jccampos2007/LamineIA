
const { check } = require('express-validator');

const notempty = "It can't be empty";
const validemail = "It must be a valid email";

const loginValidate = {
    login: [
        check('email')
            .notEmpty().withMessage(notempty)
            .isEmail().withMessage(validemail)
    ]
}

module.exports = loginValidate;