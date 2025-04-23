const AIProvider = require('../../class/providerAI');

async function chat(data) {
    try {
        const { message, intelligence, files = [] } = data;
        console.log(data);

        if (!intelligence || !message) {
            return { code: 400, message: 'Faltan parámetros requeridos.' };
        }

        const validFiles = Array.isArray(files) && files.length > 0
            ? files.map(file => `\n[Archivo: ${file.filename} - ${file.type}]\n${file.content || '(Sin contenido)'}`)
            : [];

        const prompt = `${message}\n${validFiles.join('\n')}`;

        const response = await AIProvider.request(intelligence, prompt);
        console.log(response);

        out = { code: 200, message: 'Success', data: response };
        return out;

    } catch (error) {
        return {
            code: 400,
            message: 'Error al procesar la solicitud.',
            error: error.message || error.response?.data
        };
    }
}

async function test(data) {
    try {
        const { message, intelligence, files = [] } = data;
console.log(data);

        if (!intelligence || !message) {
            return { code: 400, message: 'Faltan parámetros requeridos.' };
        }

        // Validar que files sea un array con contenido válido
        const validFiles = Array.isArray(files) && files.length > 0
            ? files.map(file => `\n[Archivo: ${file.filename} - ${file.type}]\n${file.content || '(Sin contenido)'}`)
            : [];

        const prompt = `${message}\n${validFiles.join('\n')}`;

        const response = await AIProvider.request(intelligence, prompt);
console.log(response);

        return { code: 200, message: 'Success', data: response };

    } catch (error) {
        return { code: 400, message: 'Error al procesar la solicitud.', error: error.message || error.response?.data };
    }
}

module.exports = {
    chat,
    test
};
