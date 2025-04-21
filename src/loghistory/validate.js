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
        check('idUser')
			.notEmpty().withMessage(notempty)
            .isNumeric().withMessage(notnumeric),	 
        check('uuId')
			.notEmpty().withMessage(notempty),
        check('message')
			.notEmpty().withMessage(notempty),	 
        check('type')
			.notEmpty().withMessage(notempty) 
            .isNumeric().withMessage(notnumeric)   	 
    ],
    update:[
        check('id')
			.notEmpty().withMessage(notempty)
			.isNumeric().withMessage(notnumeric),
        check('idUser')
			.notEmpty().withMessage(notempty)
            .isNumeric().withMessage(notnumeric),	 
        check('uuId')
			.notEmpty().withMessage(notempty),
        check('message')
			.notEmpty().withMessage(notempty),	 
        check('type')
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