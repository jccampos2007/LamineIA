const { SQL, toCamelCase, generateRandomStringNumber } = require("../../libs/tools");
const { createToken } = require("../../libs/token");
const { SendEmailPassword } = require("../../libs/services");
const Token = require('../../libs/token');

async function login(data) {
    try {
        let { email, otp = '' } = data;     
        let out = '';
        let token = '';

        let sql = `SELECT * FROM user WHERE email = '${email}';`;            
        let outsql = await SQL(sql);

        if (outsql.length == 0) {
            out = { code: 210, method: 'Login', message: 'Email Incorrect...!' };
        } else if(outsql[0].validate_email == 1){  
            token = Token.createToken(outsql[0]);
            out = { code: 200, method: 'Login', message: 'OK', data: outsql, token };   
        } else {
            if (outsql[0].otp === otp) {
                sql = `UPDATE user SET validate_email = 1 WHERE ${outsql[0].id};`;                   
                await SQL(sql); 
                token = Token.createToken(outsql[0]);
                out = { code: 200, method: 'Login', message: 'OK', data: outsql, token };   
            } else {
                id = outsql[0].id;
                otp = generateRandomStringNumber(6);
                sql = `UPDATE user SET otp = '${otp}' WHERE id = '${id}';`;                   
                await SQL(sql);
                await SendEmailPassword(id);
                out = { code:210, method:'Login', message: 'Email not Validated. Enter OTP Code...!', data: "Check the OTP code in your email" };
            }
        }         

        return [out, token];
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function sendOtp(data) {
    try {
        let { email } = data;

        
        let sql = `SELECT id FROM user WHERE email = '${email}';`;                   
        let outsql = await SQL(sql);

        if (outsql.length == 0) {
            return { code: 210, method: 'Send OTP', message: 'Email Incorrect...!' };
        } else {
            id = outsql[0].id;
            otp = generateRandomStringNumber(6);
            sql = `UPDATE user SET otp = '${otp}' WHERE id = '${id}';`;                   
            outsql = await SQL(sql);
        }
        SendEmailPassword(id);
        
        let out = { code: 200, method: 'Send OTP', message: 'OK', };            
        
        return out;
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

async function logout(data) {
    try {
        let { token } = data;
        ////////////////////////////////////////////////////////// 
        let user = Token.getDateToken(token);
        let idMember = user.sub.idMember;
        //////////////////////////////////////////////////////////
        let sql = `UPDATE members SET date_logout = now() WHERE id = ${idMember};`;
        await SQL(sql);
        
        let out = { code: 200, message: 'logout...!' };
        ///////////////////////                
        return (out);
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }

}


module.exports = {
    login,
    logout,
    sendOtp
}