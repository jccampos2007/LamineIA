const { SQL, toCamelCase } = require("../../libs/tools");
const Token = require('../../libs/token');
const moment = require('moment')

async function getAll(data) {
    try {
        let sql = `SELECT * FROM pay_method`;            
        let outsql = await SQL(sql);

        return out = { code: 200, method: 'Get All', message: 'OK', data: toCamelCase(outsql) };   
         
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function getOne(data) {
    try {
        let { id } = data;     

        let sql = `SELECT * FROM pay_method WHERE id = ${id};`;            
        let outsql = await SQL(sql);

        if (outsql.length != 0) {
            out = { code: 200, method: 'Get One', message: 'OK', data: toCamelCase(outsql)[0] };   
        } else {  
            out = { code: 210, method: 'Get One', message: 'pay_method Not Found...!' };
        }   

        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function add(data) {
    try {
        const { idPaymentType, methodInfJson } = data;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `INSERT INTO pay_method ( id_payment_type, method_inf_json, createdAt ) VALUES (${idPaymentType}, '${methodInfJson}', '${createdAt}');`;                   
        let outsql = await SQL(sql);
        let id = outsql.insertId;
        
        sql = `SELECT * FROM pay_method WHERE id = ${id}`;                   
        outsql = await SQL(sql);

        let out = { code: 200, method: 'Add pay_method', message: 'OK', data: toCamelCase(outsql)[0] };            
        
        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function update(data) {
    try {
        const { id, idPaymentType, methodInfJson } = data;
      
        let sql = `UPDATE pay_method SET id_payment_type = ${idPaymentType}, method_inf_json = '${methodInfJson}' WHERE id = ${id};`;     
        let outsql = await SQL(sql);
        
        sql = `SELECT * FROM pay_method WHERE id = ${id};`;                   
        outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Update pay_method', message: 'OK', data: toCamelCase(outsql)[0] };            
        
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function deleted(data) {
    try {
        const { id } = data;
        
        let sql = `DELETE FROM pay_method WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Delete pay_method', message: 'OK', data: outsql };            
        
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