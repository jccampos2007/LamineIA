const { SQL, toCamelCase } = require("../../libs/tools");
const Token = require('../../libs/token');
const moment = require('moment')

async function getAll(data) {
    try {
        let sql = `SELECT * FROM payment_type`;            
        let outsql = await SQL(sql);

        return out = { code: 200, method: 'Get All', message: 'OK', data: toCamelCase(outsql) };   
         
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function getOne(data) {
    try {
        let { id } = data;     

        let sql = `SELECT * FROM payment_type WHERE id = ${id};`;            
        let outsql = await SQL(sql);

        if (outsql.length != 0) {
            out = { code: 200, method: 'Get One', message: 'OK', data: toCamelCase(outsql)[0] };   
        } else {  
            out = { code: 210, method: 'Get One', message: 'payment_type Not Found...!' };
        }   

        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function add(data) {
    try {
        const { name, paymentGateway } = data;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `INSERT INTO payment_type (name, payment_gateway, createdAt) VALUES ('${name}', '${paymentGateway}', '${createdAt}');`;                   
        let outsql = await SQL(sql);
        let id = outsql.insertId;
        
        sql = `SELECT * FROM payment_type WHERE id = ${id}`;                   
        outsql = await SQL(sql);

        let out = { code: 200, method: 'Add payment_type', message: 'OK', data: toCamelCase(outsql)[0] };            
        
        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function update(data) {
    try {
        const { id, name, paymentGateway, status } = data;

        const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `UPDATE payment_type SET name = '${name}', payment_gateway = '${paymentGateway}', status = ${status}, updatedAt = '${updatedAt}' WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        sql = `SELECT * FROM payment_type WHERE id = ${id};`;                   
        outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Update payment_type', message: 'OK', data: toCamelCase(outsql)[0] };            
        
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function deleted(data) {
    try {
        const { id } = data;
        
        let sql = `DELETE FROM payment_type WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Delete payment_type', message: 'OK', data: outsql };            
        
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

module.exports = {
    getAll,
    getOne,
    add,
    update,
    deleted
}