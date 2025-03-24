const axios = require('axios');
const cfg = require('../../libs/env');
const GROQ_API_KEY = cfg.GROQ_API_KEY;
const HIGGING_API_KEY = cfg.HIGGING_API_KEY;

async function chat(data) {
    try {
        let { message, IA } = data;
        let model = '';

        switch (IA) {
            case 'groq':
                model = {
                    url: 'https://api.groq.com/openai/v1/chat/completions',
                    body: {
                        model: "llama3-8b-8192", // Puedes usar "llama3-70b-8192" si necesitas más potencia
                        messages: [{ role: "user", content: message }],
                        temperature: 0.7
                    },
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                };
                break;
            case 'huggingface':
                model = {
                    url: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
                    body: {
                        inputs: message
                    },
                    headers: {
                        'Authorization': `Bearer ${HIGGING_API_KEY}`,
                        'Content-Type': 'application/json',
                        'x-use-cache': 'false'
                    }
                };
                break;
        }

        let response = await axios.post(
            model.url,
            model.body,
            { headers: model.headers }
        );

        switch (IA) {
            case 'groq':
                response = response.data.choices[0].message.content;
                break;
            case 'huggingface':
                response = response.data[0].generated_text;
                break;
        }

        return { code: 200, message: 'Success', data: response };

    } catch (error) {
        return { code: 400, message: 'Error al procesar la solicitud.', error: error.response?.data || error.message};
    }
}

module.exports = {
    chat
};
