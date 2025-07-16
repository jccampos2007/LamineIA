const { check, query } = require('express-validator');
const { paginator } = require('./model');

const notempty = "It can't be empty";
const notnumeric = "Must Be Numeric";
const validemail = "It must be a valid email";


const loginValidate = {     
    paginator:[
        query('start')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric),
        query('lenght')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric),
        query('order')
			.notEmpty().withMessage(notempty)      	 
    ],
    
    getOne:[
        query('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],
    add:[  
        check('message')
			.notEmpty().withMessage(notempty),
        check('response')
			.notEmpty().withMessage(notempty),	 
        check('files')
			.notEmpty().withMessage(notempty) 
             	 
    ],
    update:[
        check('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric),
            check('message')
			.notEmpty().withMessage(notempty),
        check('response')
			.notEmpty().withMessage(notempty),	 
        check('files')
			.notEmpty().withMessage(notempty)   	 	 
    ],
    delete:[
        query('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],
}

module.exports = loginValidate;