const axios = require('axios');
const cfg = require('../../libs/env');
const GROQ_API_KEY = cfg.GROQ_API_KEY;

async function chat(data) {
    try {
        let { message } = data;

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama3-8b-8192", // Puedes usar "llama3-70b-8192" si necesitas más potencia
                messages: [{ role: "user", content: message }],
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        
        return { code: 200, message: 'Success', /*data: response.data.choices[0].message.content,*/ response: response.data };

    } catch (error) {
        return { 
            code: 400, 
            message: 'Error al procesar la solicitud.',
            error: error.response?.data || error.message
        };
    }
}

async function test(headers) {
    try {
        let { token } = headers;

        
        return { code: 200, message: 'Success' };

    } catch (error) {
        return { code: 400, message: 'Error al procesar la solicitud.', error: error.response?.data || error.message
        };
    }
}

module.exports = {
    chat
};
