require('dotenv').config({});

module.exports = {
    SECRET_TOKEN: process.env.SECRET_TOKEN,
    DBHOST: process.env.DB_HOST,
    DBPORT: process.env.DB_PORT,
    DBUSER: process.env.DB_USER,
    DBPASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE,
    DBCHARTSET: process.env.DB_CHARTSET,
    PORT: process.env.PORT,
    ENVIRONMENT: process.env.ENVIRONMENT,
    EMAILAPP: process.env.EMAIL_APP,
    PUBLICKEYWEBPUSH: process.env.PUBLIC_KEY,
    PRIVATEKEYWEBPUSH: process.env.PRIVATE_KEY,
    MONGODB: process.env.MONGODB,
    URL_APP: process.env.URL_APP,
    //////////////////////////////////////
    URL_LOGIN: process.env.URL_LOGIN,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    SCOPE: process.env.SCOPE,
    GRANT_TYPE: process.env.GRANT_TYPE,
    URL_SEND: process.env.URL_SEND,
    URL_SEND_UPDATE_DEPENDENT: process.env.URL_SEND_UPDATE_DEPENDENT,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    HIGGING_API_KEY: process.env.HIGGING_API_KEY,
    CERTIFICATE_KEY: process.env.CERTIFICATE_KEY,
    CERTIFICATE_CRT: process.env.CERTIFICATE_CRT
};  