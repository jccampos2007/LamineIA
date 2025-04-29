const AIProvider = require('../../class/providerAI');
const { SQL } = require("../../libs/tools");
const moment = require('moment');
const Token = require('../../libs/token');

async function chat(data, header) {
    try {
        const { message, intelligence, files = [] } = data;
        const { token } = header;
        const user = Token.getDateToken(token);
        let idUser = user.sub.id;
        let date = moment().format('YYYY-MM-DD HH:mm:ss');

        if (!intelligence || !message) {
            return { code: 400, message: 'Faltan parámetros requeridos.' };
        }

        const validFiles = Array.isArray(files) && files.length > 0
            ? files.map(file => `\n[Archivo: ${file.filename} - ${file.type} - ${file.path}]\n${file.content || '(Sin contenido)'}`)
            : [];

        const filesSent = validFiles.map(file => {
            const match = file.match(/\[.*?\]/); // Busca el contenido entre corchetes
            return match ? match[0] : null; // Devuelve el contenido entre corchetes o null si no hay coincidencia
        }).filter(Boolean); // Filtra los valores nulos

        let escapedFilesSent = JSON.stringify(filesSent).replace(/\\/g, '\\\\'); // Escapa las barras invertidas

        let sql = `INSERT INTO log_history (id_user, message, files, type, createdAt) VALUES(${idUser}, "${message}", '${escapedFilesSent}', 1, '${date}')`;
        await SQL(sql);
        let explication = `y adicional explica el porque se hace de esa forma\n`;

        const prompt = `${message}\n${validFiles.join('\n')}\n${explication}`;

        let response = await AIProvider.request(intelligence, prompt);
        // console.log(response);

        out = { code: 200, message: 'Success', data: response };

        response = escapeSQL(response);

        sql = `INSERT INTO log_history (id_user, message, files, type, createdAt) VALUES(${idUser}, "${response}", '${escapedFilesSent}', 2, '${date}')`;
        await SQL(sql);
        return out;

    } catch (error) {
        return { code: 400, message: 'Error al procesar la solicitud.', error: error.message || error.response?.data };
    }
}

async function test(data, header) {
    try {
        const { message, intelligence, files = [] } = data;
        const { token } = header;
        const user = Token.getDateToken(token);
        let idUser = user.sub.id;
        let date = moment().format('YYYY-MM-DD HH:mm:ss');

        if (!intelligence || !message) {
            return { code: 400, message: 'Faltan parámetros requeridos.' };
        }

        const validFiles = Array.isArray(files) && files.length > 0
            ? files.map(file => `\n[Archivo: ${file.filename} - ${file.type} - ${file.path}]\n${file.content || '(Sin contenido)'}`)
            : [];

        const filesSent = validFiles.map(file => {
            const match = file.match(/\[.*?\]/); // Busca el contenido entre corchetes
            return match ? match[0] : null; // Devuelve el contenido entre corchetes o null si no hay coincidencia
        }).filter(Boolean); // Filtra los valores nulos

        let escapedFilesSent = JSON.stringify(filesSent).replace(/\\/g, '\\\\'); // Escapa las barras invertidas

        let sql = `INSERT INTO log_history (id_user, message, files, type, createdAt) VALUES(${idUser}, "${message}", '${escapedFilesSent}', 1, '${date}')`;
        await SQL(sql);
        let explication = `y adicional explica el porque se hace de esa forma\n`;

        const prompt = `${message}\n${validFiles.join('\n')}\n${explication}`;

        let response = await AIProvider.request(intelligence, prompt);
        console.log(response);

        out = { code: 200, message: 'Success', data: response };

        response = escapeSQL(response);

        sql = `INSERT INTO log_history (id_user, message, files, type, createdAt) VALUES(${idUser}, "${response}", '${escapedFilesSent}', 2, '${date}')`;
        await SQL(sql);
        return out;

    } catch (error) {
        return { code: 400, message: 'Error al procesar la solicitud.', error: error.message || error.response?.data };
    }
}

function escapeSQL(value) {
    return value.replace(/"/g, '\\"').replace(/'/g, "\\'");
}

module.exports = {
    chat,
    test
};
