const { SQL, toCamelCase } = require("../../libs/tools");
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
        let sql = `SELECT count(id) as recordsTotal FROM log_history WHERE id_user = ${idUser}`
        let outsql = await SQL(sql);
        let recordsTotal = outsql[0].recordsTotal;

        sql = `SELECT count(id) as recordsFiltered 
                FROM log_history 
                WHERE id_user = ${idUser} AND 
                (message like CONCAT('%', '${search}' , '%')
                OR response like CONCAT('%', '${search}' , '%'))`
                console.log(sql)
        outsql = await SQL(sql);
        let recordsFiltered = outsql[0].recordsFiltered;

        sql = `SELECT * FROM log_history 
                WHERE id_user = ${idUser} AND 
                (message like CONCAT('%', '${search}' , '%')
                OR response like CONCAT('%', '${search}' , '%'))
                ORDER BY ${sort} ${order} LIMIT ${start}, ${lenght}`; 
        outsql = await SQL(sql);        
        let list = outsql

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

async function getAll(headers) {
    try {
        let {token} = headers;
        let user = Token.getDateToken(token);
        let idUser = user.sub.id;
        let sql = `SELECT * FROM log_history WHERE id_user = ${idUser}`;           
        let outsql = await SQL(sql);

        return out = { code: 200, method: 'Get All', message: 'OK', data: toCamelCase(outsql) };   
         
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function getOne(data,headers) {
    try {
        let {token} = headers;
        let user = Token.getDateToken(token);
        let idUser = user.sub.id;
        let { id } = data;     

        let sql = `SELECT * FROM log_history WHERE id = ${id} AND id_user = ${idUser};`;            
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

async function add(data,headers) {
    try {
        let {token} = headers;
        let user = Token.getDateToken(token);
        let idUser = user.sub.id;
        const { message, response, files } = data;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        
        let sql = `INSERT INTO log_history ( id_user, message, response, files, createdAt ) VALUES (${idUser}, '${message}', '${response}', '${files}', '${createdAt}');`;                   
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

async function update(data,headers) {
    try {
        let {token} = headers;
        let user = Token.getDateToken(token);
        let idUser = user.sub.id;
        const { id, message, response, files } = data;
      
        let sql = `UPDATE log_history SET id_user = ${idUser}, message = '${message}', response = '${response}', files = '${files}' WHERE id = ${id};`; 
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
    deleted,
    paginator
}