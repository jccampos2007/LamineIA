
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
        check('email')
			.notEmpty().withMessage(notempty)
			.isEmail().withMessage(validemail)	 
    ],
    update:[
        check('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric),      
        check('email')
            .notEmpty().withMessage(notempty)
            .isEmail().withMessage(validemail)		 
    ],
    delete:[
        query('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],
}

module.exports = loginValidate;