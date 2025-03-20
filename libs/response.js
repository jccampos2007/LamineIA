
async function Response200Login(method, message, dt, token) {
    return {
        "code":200,
        "method":method,
        "message":message,
        "data":dt,
        "token":token
    }      
}

async function Response401Login(method, message, dt, token) {
    return {
        "code":401,
        "method":method,
        "message":message,
        "data":dt,
        "token":token
    }      
}

async function ResponseErrorSQL(method, error) {
    return {
        "code":400,
        "method":method,
        "message":"Sql Error",
        "error":error,
         
    }      
}

async function Response200(method, message, dt) {
    return {
        "code":200,
        "method":method,
        "message":message,
        "data":dt       
    }      
}

async function Response210(method, message, dt) {
    return {
        "code":210,
        "method":method,
        "message":message,
        "data":dt       
    }      
}

module.exports = {
    Response200Login,
    Response401Login,
    ResponseErrorSQL,
    Response200,
    Response210
    
}