const AIProvider = require('../../class/providerAI');

async function chat(data) {
    try {
        const { message, intelligence } = data;

        if (!intelligence || !message) {
            return { code: 400, message: 'Faltan parámetros requeridos.' };
        }

        const response = await AIProvider.request(intelligence, message);

        return { code: 200, message: 'Success', data: response };

    } catch (error) {
        return {
            code: 400,
            message: 'Error al procesar la solicitud.',
            error: error.message || error.response?.data
        };
    }
}

module.exports = {
    chat
};
