const AIProvider = require('../../class/providerAI');
const { SQL } = require("../../libs/tools");
const moment = require('moment');
const Token = require('../../libs/token');
const mysql = require('mysql2'); // o mysql2 si usas ese paquete

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
            return match ? match[0] : null;
        }).filter(Boolean);

        let escapedFilesSent = JSON.stringify(filesSent).replace(/\\/g, '\\\\'); // Escapa las barras invertidas

        let orden = ``;
        let explication = `y adicional dame al final un area llamada estrictamente **Explicación:** con el porque se hace de esa forma\n`;

        if (files != []) orden = `a cada respuesta asegurate de que tengan la ruta correspondiente de a cual archivo pertenece esa respuesta en el mismo formato ${escapedFilesSent} no quiero que sea entre ** quiero que sea entre corchetes []\n`;

        const prompt = `${message}\n${validFiles.join('\n')}\n${explication}\n${orden}`;

        let response = await AIProvider.request(intelligence, prompt);
        // response = "Here is the JavaScript code and the JSON file:\n\n```[Archivo: index.js - file - src\\index.js]\n```\nJavaScript code:\n```\nfetch('ganadores.json')\n\t.then(response => response.json())\n\t.then(data => {\n\t\tconst ganador = data.ganador;\n\t\tdocument.getElementById(\"ganador\").innerHTML = ganador;\n\t});\n```\n\n[Archivo: ganadores.json - file - src\\ganadores.json]\n```\n{\n\t\"ganador\": \"Juan Pérez\"\n}\n```\n**Explicación:** We use the Fetch API to load the JSON file `ganadores.json` and then parse it into a JavaScript object using the `json()` method. Once the data is parsed, we extract the `ganador` property and set its value as the innerHTML of the element with the id `ganador`. This way, we dynamically update the content of the page with the data from the JSON file.\n\nNote that we use `fetch` instead of `XMLHttpRequest` to make the request, and we use the `then` method to handle the response as a JSON object. This is a modern and recommended way to make HTTP requests in JavaScript."

        escapedMessage = mysql.escape(message);
        response = escapeSQL(response);

        let sql = `INSERT INTO log_history (id_user, message, response, files, createdAt) VALUES(${idUser}, ${escapedMessage}, "${response}", '${escapedFilesSent}', '${date}')`;
        await SQL(sql);

        out = { code: 200, message: 'Success', data: response };
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
        
        
        const escapedMessage = mysql.escape(message);
        let sql = `INSERT INTO log_history (id_user, message, files, type, createdAt) VALUES(${idUser}, ${escapedMessage}, '${escapedFilesSent}', 1, '${date}')`;
        await SQL(sql);
        let orden = ``;
        let explication = `y adicional dame al final un area llamada estrictamente **Explicación:** con el porque se hace de esa forma\n`;

        if (files != []) orden = `a cada respuesta asegurate de que tengan la ruta correspondiente de a cual archivo pertenece esa respuesta en el mismo formato ${escapedFilesSent} no quiero que sea entre ** quiero que sea entre corchetes []\n`;

        const prompt = `${message}\n${validFiles.join('\n')}\n${explication}\n${orden}`;

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

function escapeSQL(value) {
    return value.replace(/"/g, '\\"').replace(/'/g, "\\'");
}

module.exports = {
    chat,
    test
};
