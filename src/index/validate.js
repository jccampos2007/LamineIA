const { check } = require('express-validator');

const notempty = "It can't be empty";
const notnumeric = "Must Be Numeric";
const validemail = "It must be a valid email";


const countryValidate = {               
    getone: [
        //check('id')
        //    .notEmpty().withMessage(notempty)  
        //    .isNumeric().withMessage(notnumeric)                   
    ]          
}

module.exports = countryValidate;