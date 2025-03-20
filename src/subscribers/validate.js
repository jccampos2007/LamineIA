
const { check, query } = require('express-validator');

const notempty = "It can't be empty";
const notnumeric = "Must Be Numeric";
const validemail = "It must be a valid email";


const loginValidate = {     
    getOne:[
        query('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],
    add:[
        check('id_user')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric),
        check('period')
			.notEmpty().withMessage(notempty),
        check('apiKey')
			.notEmpty().withMessage(notempty)
    ],
    delete:[
        query('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],
}

module.exports = loginValidate;