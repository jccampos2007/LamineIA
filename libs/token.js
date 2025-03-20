const moment = require('moment');
const Tools = require('./tools');

function createToken(user) {
    const payload = {
        sub: user,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    }

    return Tools.Encritar(payload);
}

function decodeToken(token) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = Tools.DesEncritar(token);

            if (payload.exp <= moment().unix()) {
                reject({
                    status: 403,
                    message: 'The token has expired'
                })
            }
            resolve(payload.sub)
        } catch (err) {
            reject({
                status: 403,
                message: 'Invalid Token'
            })
        }
    })

    return decoded
}

function getDateToken(token) {
    return Tools.DesEncritar(token);
}

function tokenCheck(req, res, next) {
    if (!req.body.token) {
        return res.status(403).json({ code: 403, messageServer: 'Access Denied...!', message: 'You dont have authorization: token' })
    }

    decodeToken(req.body.token)
        .then(response => {
            req.user = response
            next()
        })
        .catch(response => {
             
            res.status(403).json({ code: 403, messageServer: 'Access Denied...!', message: response.message })
        })
}

/*function verifyToken(req, res, next) {
    let token = req.header('token');
    if(!token) return res.status(403).json({ code: 403, messageServer: 'Access Denied...!', message: 'You dont have authorization: token' });
    
    decodeToken(req.headers.token)
    .then(response => {
        req.user = response
        next()
    })
    .catch(response => {
         
        res.status(403).json({ code: 403, messageServer: 'Access Denied...!', message: response.message })
    })
}*/

function verifyToken(req, res, next) {
    const beareHeader = req.headers['authorization'];
     
    if(!beareHeader) return res.status(403).json({ code: 403, messageServer: 'Access Denied...!', message: 'You dont have authorization: token' });

    const bearerToken = beareHeader.split(" ")[1];
         
    if(!bearerToken) return res.status(403).json({ code: 403, messageServer: 'Access Denied...!', message: 'You dont have authorization: token' });
    
    decodeToken(bearerToken)
    .then(response => {        
        req.user = response
        req.token = bearerToken
        next()
    })
    .catch(response => {
         
        res.status(403).json({ code: 403, messageServer: 'Access Denied...!', message: response.message })
    })
}

module.exports = {
    createToken,
    decodeToken,
    getDateToken,
    tokenCheck,
    verifyToken
}