
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
			.notEmpty().withMessage(notempty)      	 
    ],

    getAll:[
        query('idSubscribers')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],
    getOne:[
        query('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],
    add:[ 
        check('idSubscribers')
			.notEmpty().withMessage(notempty)
            .isNumeric().withMessage(notnumeric),	 
        check('idPayMethod')
			.notEmpty().withMessage(notempty)
            .isNumeric().withMessage(notnumeric),	
        check('amount')
			.notEmpty().withMessage(notempty),	      
    ],
    update:[
        check('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric),
        check('idSubscribers')
			.notEmpty().withMessage(notempty)
            .isNumeric().withMessage(notnumeric),	 
        check('idPayMethod')
			.notEmpty().withMessage(notempty)
            .isNumeric().withMessage(notnumeric),	
        check('amount')
			.notEmpty().withMessage(notempty) 
    ],
    delete:[
        query('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric)	 
    ],

    confirm:[
        check('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric), 
    ],
}



module.exports = loginValidate;