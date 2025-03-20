const { check, query } = require('express-validator');

const notempty = "It can't be empty";
const notnumeric = "Must Be Numeric";
const validemail = "It must be a valid email";


const bannerValidate = {
    chat: [ 
            check('message')
                .notEmpty().withMessage(notempty)
        ]
}

module.exports = bannerValidate;