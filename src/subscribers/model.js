const { SQL, toCamelCase, generateRandomStringNumber } = require("../../libs/tools");
const { createToken } = require("../../libs/token");
const { SendEmailPassword } = require("../../libs/services");
const Token = require('../../libs/token');
const moment = require('moment')

async function paginator(data,headers) {
    try {
        let {token} = headers;
        let {start, lenght, search, order, sort} = data;
        let user = Token.getDateToken(token);
        let idUser = user.sub.id;
        if (search == undefined || search == '') search = '';
        if (sort == undefined || sort == '') sort = 'id';
        let sql = `SELECT count(sb.id) as recordsTotal FROM subscribers sb
                     INNER JOIN user u ON sb.id_user = u.id;`;
        let outsql = await SQL(sql);
        let recordsTotal = outsql[0].recordsTotal;

        sql = `SELECT count(sb.id) as recordsFiltered 
                FROM subscribers sb
                     INNER JOIN user u ON sb.id_user = u.id 
                     WHERE (sb.period LIKE CONCAT('%', '${search}', '%') OR 
                            u.email LIKE CONCAT('%', '${search}', '%'))`
        outsql = await SQL(sql);
        let recordsFiltered = outsql[0].recordsFiltered;

        sql = `SELECT sb.*, u.email
                FROM subscribers sb
                     INNER JOIN user u ON sb.id_user = u.id 
                     WHERE (sb.period LIKE CONCAT('%', '${search}', '%') OR 
                            u.email LIKE CONCAT('%', '${search}', '%')) 
                ORDER BY sb.${sort} ${order} LIMIT ${start}, ${lenght}`; 
        outsql = await SQL(sql);        
        let list = toCamelCase(outsql);

        let out = {
            code: 200,
            message: "Paginator...!",
            data: { recordsTotal, recordsFiltered, list }
          };
      
          return out;

    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function getAll(data) {
    try {
        let sql = `SELECT s.*,u.email FROM subscribers s INNER JOIN user u ON s.id_user = u.id`;            
        let outsql = await SQL(sql);

        return out = { code: 200, method: 'Get All', message: 'OK', data: toCamelCase(outsql) };   
         
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
            out = { code: 200, method: 'Get One', message: 'OK', data: toCamelCase(outsql)[0] };   
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
        const { idUser, period, apiKey } = data;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `INSERT INTO subscribers (id_user, period, api_key, createdAt) VALUES (${idUser}, '${period}', '${apiKey}', '${createdAt}');`;                   
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
    deleted,
    paginator
}