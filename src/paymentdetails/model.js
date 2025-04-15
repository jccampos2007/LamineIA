const { SQL, toCamelCase } = require("../../libs/tools");
const Token = require('../../libs/token');
const moment = require('moment')

async function getAll(data) {
    try {
        let sql = `SELECT * FROM payment_details`;            
        let outsql = await SQL(sql);

        return out = { code: 200, method: 'Get All', message: 'OK', data: toCamelCase(outsql) };   
         
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function getOne(data) {
    try {
        let { id } = data;     

        let sql = `SELECT * FROM payment_details WHERE id = ${id};`;            
        let outsql = await SQL(sql);

        if (outsql.length != 0) {
            out = { code: 200, method: 'Get One', message: 'OK', data: toCamelCase(outsql)[0] };   
        } else {  
            out = { code: 210, method: 'Get One', message: 'payment_details Not Found...!' };
        }   

        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function add(data) {
    try {
        const { idSubscribers, idPayMethod, amount } = data;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `INSERT INTO payment_details (id_subscribers, id_pay_method, amount, createdAt ) VALUES (${idSubscribers}, ${idPayMethod}, '${amount}', '${createdAt}');`;                   
        let outsql = await SQL(sql);
        let id = outsql.insertId;
        
        sql = `SELECT * FROM payment_details WHERE id = ${id}`;                   
        outsql = await SQL(sql);

        let out = { code: 200, method: 'Add payment_details', message: 'OK', data: toCamelCase(outsql)[0] };            
        
        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function update(data) {
    try {
        const { id, idSubscribers, idPayMethod, amount } = data;

        const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `UPDATE payment_details SET id_subscribers = ${idSubscribers}, id_pay_method = ${idPayMethod}, amount = '${amount}', updatedAt = '${updatedAt}' WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        sql = `SELECT * FROM payment_details WHERE id = ${id};`;                   
        outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Update payment_details', message: 'OK', data: toCamelCase(outsql)[0] };            
        
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function deleted(data) {
    try {
        const { id } = data;
        
        let sql = `DELETE FROM payment_details WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Delete payment_details', message: 'OK', data: outsql };            
        
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function confirm(data) {
    try {
        const { id } = data;
        
        let sql = `UPDATE payment_details SET confirm = 1 WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        sql = `SELECT * FROM payment_details WHERE id = ${id};`;                   
        outsql = await SQL(sql);
        if(outsql.length ==0){
            return out = { code: 210, method: 'confirm payment_details', message: 'subscriber not found' };            
        
        }
        return out = { code: 200, method: 'confirm payment_details', message: 'OK', data: toCamelCase(outsql)[0] };            
        
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}
module.exports = {
    getAll,
    getOne,
    add,
    update,
    deleted,
    confirm
}