const { SQL, toCamelCase } = require("../../libs/tools");
const Token = require('../../libs/token');
const moment = require('moment')

async function getAll(data) {
    try {
        let sql = `SELECT * FROM log_history`;            
        let outsql = await SQL(sql);

        return out = { code: 200, method: 'Get All', message: 'OK', data: toCamelCase(outsql) };   
         
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function getOne(data) {
    try {
        let { id } = data;     

        let sql = `SELECT * FROM log_history WHERE id = ${id};`;            
        let outsql = await SQL(sql);

        if (outsql.length != 0) {
            out = { code: 200, method: 'Get One', message: 'OK', data: toCamelCase(outsql)[0] };   
        } else {  
            out = { code: 210, method: 'Get One', message: 'log_history Not Found...!' };
        }   

        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function add(data) {
    try {
        const { idUser, uuId, message, type } = data;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `INSERT INTO log_history ( id_user, uuid, message, type, createdAt ) VALUES (${idUser}, '${uuId}', '${message}', '${type}', '${createdAt}');`;                   
        let outsql = await SQL(sql);
        let id = outsql.insertId;
        
        sql = `SELECT * FROM log_history WHERE id = ${id}`;                   
        outsql = await SQL(sql);

        let out = { code: 200, method: 'Add log_history', message: 'OK', data: toCamelCase(outsql)[0] };            
        
        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function update(data) {
    try {
        const { id, idUser, uuId, message, type } = data;
      
        let sql = `UPDATE log_history SET id_user = ${idUser}, uuid = '${uuId}', message = '${message}', type = ${type} WHERE id = ${id};`;     
        let outsql = await SQL(sql);
        
        sql = `SELECT * FROM log_history WHERE id = ${id};`;                   
        outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Update log_history', message: 'OK', data: toCamelCase(outsql)[0] };            
        
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function deleted(data) {
    try {
        const { id } = data;
        
        let sql = `DELETE FROM log_history WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Delete log_history', message: 'OK', data: outsql };            
        
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