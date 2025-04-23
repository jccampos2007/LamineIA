const { SQL, generateRandomStringNumber } = require("../../libs/tools");
const { SendEmailPassword } = require("../../libs/services");
const Token = require('../../libs/token');
const moment = require('moment');

async function login(data) {
    try {
        let { email, otp = '' } = data;
        let out = '';
        let token = '';

        let sql = `SELECT * FROM user WHERE email = '${email}';`;
        let outsql = await SQL(sql);

        if (outsql.length == 0) {
            const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
            otp = generateRandomStringNumber(6);
            let sql = `INSERT INTO user (email, otp, createdAt) VALUES ('${email}', '${otp}' , '${createdAt}');`;
            let outsql = await SQL(sql);
            let id = outsql.insertId;
            await SendEmailPassword(id);
            out = { code: 210, method: 'Login', message: 'Email not Validated. Enter OTP Code...!', data: "Check the OTP code in your email" };
        } else if (outsql[0].validate_email == 1) {
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
                out = { code: 210, method: 'Login', message: 'Email not Validated. Enter OTP Code...!', data: "Check the OTP code in your email" };
            }
        }

        return [out, token];
    } catch (error) {
        return ({ code: 400, message: 'Sql Errors', error: error.sqlMessage });
    }
}

module.exports = {
    login
}