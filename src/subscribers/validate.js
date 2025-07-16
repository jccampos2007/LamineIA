
const { check, query } = require('express-validator');

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
			.notEmpty().withMessage(notempty),
        query('search')
			.notEmpty().withMessage(notempty)    
    ],
    
    getOne:[
        query('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],
    add:[
        check('idUser')
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