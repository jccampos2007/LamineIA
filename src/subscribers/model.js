const { SQL, toCamelCase, generateRandomStringNumber } = require("../../libs/tools");
const { createToken } = require("../../libs/token");
const { SendEmailPassword } = require("../../libs/services");
const Token = require('../../libs/token');
const moment = require('moment')

async function getAll(data) {
    try {
        let sql = `SELECT * FROM subscribers`;            
        let outsql = await SQL(sql);

        return out = { code: 200, method: 'Get All', message: 'OK', data: outsql };   
         
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function getOne(data) {
    try {
        let { id } = data;     

        let sql = `SELECT * FROM subscribers WHERE id = ${id};`;            
        let outsql = await SQL(sql);

        if (outsql.length != 0) {
            out = { code: 200, method: 'Get One', message: 'OK', data: outsql };   
        } else {  
            out = { code: 210, method: 'Get One', message: 'subscribers Not Found...!' };
        }   

        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function add(data) {
    try {
        const { id_user, period, apiKey } = data;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `INSERT INTO subscribers (id_user, period, api_key, createdAt) VALUES (${id_user}, '${period}', '${apiKey}', '${createdAt}');`;                   
        let outsql = await SQL(sql);
        let id = outsql.insertId;
        
        sql = `SELECT * FROM subscribers WHERE id = ${id}`;                   
        outsql = await SQL(sql);

        let out = { code: 200, method: 'Add subscribers', message: 'OK', data: toCamelCase(outsql)[0] };            
        
        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function deleted(data) {
    try {
        const { id } = data;
        
        let sql = `DELETE FROM subscribers WHERE id = ${id}`;     
        let outsql = await SQL(sql);
        
        return out = { code: 200, method: 'Delete subscribers', message: 'OK', data: outsql };            
        
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

module.exports = {
    getAll,
    getOne,
    add,
    deleted
}