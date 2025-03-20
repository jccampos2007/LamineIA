const { SQL, toCamelCase, generateRandomStringNumber } = require("../../libs/tools");
const { createToken } = require("../../libs/token");
const { SendEmailPassword } = require("../../libs/services");
const Token = require('../../libs/token');
const moment = require('moment')

async function getAll(data) {
    try {
        let sql = `SELECT * FROM user`;            
        let outsql = await SQL(sql);

        return out = { code: 200, method: 'Get All', message: 'OK', data: outsql };   
         
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function getOne(data) {
    try {
        let { id } = data;     

        let sql = `SELECT * FROM user WHERE id = ${id};`;            
        let outsql = await SQL(sql);

        if (outsql.length != 0) {
            out = { code: 200, method: 'Get One', message: 'OK', data: outsql };   
        } else {  
            out = { code: 210, method: 'Get One', message: 'User Not Found...!' };
        }   

        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function add(data) {
    try {
        const { email } = data;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `INSERT INTO user (email, createdAt) VALUES ('${email}', '${createdAt}');`;                   
        let outsql = await SQL(sql);
        let id = outsql.insertId;
        
        sql = `SELECT * FROM user WHERE id = ${id}`;                   
        outsql = await SQL(sql);

        let out = { code: 200, method: 'Add User', message: 'OK', data: outsql[0] };            
        
        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function update(data) {
    try {
        const { id, email } = data;
        
        let sql = `UPDATE user SET email = '${email}' WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        sql = `SELECT * FROM user WHERE id = ${id};`;                   
        outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Update User', message: 'OK', data: outsql };            
        
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function deleted(data) {
    try {
        const { id } = data;
        
        let sql = `DELETE FROM user WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Delete User', message: 'OK', data: outsql };            
        
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