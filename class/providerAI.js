const axios = require('axios');
const cfg = require('../libs/env');

class AIProvider {
    constructor() {
        this.providers = {
            groq: {
                url: 'https://api.groq.com/openai/v1/chat/completions',
                key: cfg.GROQ_API_KEY,
                model: "llama3-8b-8192",
                temperature: 0.7
            },
            huggingface: {
                url: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
                key: cfg.HIGGING_API_KEY
            }
        };
    }

    // Método para construir el payload según el proveedor
    buildPayload(provider, message) {
        let out = {};
        switch (provider) {
            case 'groq':
                out = {
                    body: {
                        model: this.providers[provider].model,
                        messages: [{ role: "user", content: message }],
                        temperature: this.providers[provider].temperature
                    },
                    headers: {
                        'Authorization': `Bearer ${this.providers[provider].key}`,
                        'Content-Type': 'application/json'
                    }
                };
                break;
            case 'huggingface':
                out = {
                    body: { inputs: message },
                    headers: {
                        'Authorization': `Bearer ${this.providers[provider].key}`,
                        'Content-Type': 'application/json',
                        'x-use-cache': 'false'
                    }
                };
                break;
        
        }
        return out;
    }

    // Método para enviar la solicitud a la API
    async request(provider, message) {
        if (!this.providers[provider]) {
            throw new Error(`Proveedor desconocido: ${provider}`);
        }

        const { url } = this.providers[provider];
        const { body, headers } = this.buildPayload(provider, message);

        const response = await axios.post(url, body, { headers });

        let result = '';
        if (provider === 'groq') {
            result = response.data.choices[0].message.content;
        } else if (provider === 'huggingface') {
            result = response.data[0].generated_text;
        }

        return result;
    }
}

module.exports = new AIProvider();
