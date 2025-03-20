
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
        check('name')
			.notEmpty().withMessage(notempty),	 
        check('paymentGateway')
			.notEmpty().withMessage(notempty)	 
    ],
    update:[
        check('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric),
        check('name')
            .notEmpty().withMessage(notempty),	 
        check('paymentGateway')
            .notEmpty().withMessage(notempty),
        check('status')
            .notEmpty().withMessage(notempty)
            .isNumeric().withMessage(notnumeric)	 
    ],
    delete:[
        query('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],
}

module.exports = loginValidate;