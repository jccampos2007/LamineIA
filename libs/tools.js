const nodemailer = require("nodemailer");
const {dbconn,dbconnCRM} = require('./db');
const CryptoJS = require("crypto-js");
const config = require('./env');
const pupeeteer = require('puppeteer'); 
const validator = require("email-validator"); 
const moment = require('moment');
 

async function SendEmail(host, port, service, username, password, from, to, subject, html, listcc = []) {

                
    let transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: service, // upgrade later with STARTTLS
        auth: {
          user: username,
          pass: password,
        },
      });
     
    
    const mailBody = {
        from,
        to,
        cc:listcc,
        subject,
        html         
    };
      
    return await transporter.sendMail(mailBody); 
}

async function SendEmailFile(service, username, password, from, to, subject, html, file_name, file_dir) {
    
    let transporter = nodemailer.createTransport({
        service:service,        
        auth: {
          user:username, // generated ethereal user
          pass:password, // generated ethereal password
        },
    });
 
    const mailBody = {
        from:from,
        to:to,
        subject:subject,
        html:html,
        attachments: [
            {
                filename: file_name,
                path: file_dir,
            }
        ]         
    };
  
    return await transporter.sendMail(mailBody); 
}

async function SendEmailClient(host, port, user, pass, from, to, subject, html, secure) {
     
    let transporter = nodemailer.createTransport({
        host,
        port,
        secure, // true for 465, false for other ports
        auth: {
          user, // generated ethereal user
          pass, // generated ethereal password
        },
    });
     
    
    const mailBody = {
        from,
        to,
        subject,
        html
         
    };
      
    return await transporter.sendMail(mailBody); 
}

async function SendEmailFileClient(host, port, user, pass, from, to, subject, html, file_name, file_dir, secure) {
    let transporter = nodemailer.createTransport({
        host,
        port,
        secure, // true for 465, false for other ports
        auth: {
        user, // generated ethereal user
        pass, // generated ethereal password
        },
    });
 
    const mailBody = {
        from,
        to,
        subject,
        html,
        attachments: [
            {
                filename: file_name,
                path: file_dir,
            }
        ]         
    };
  
    return await transporter.sendMail(mailBody); 
}

// SendE_mail
async function SendE_mail(to, subject, html, client_id, id_service_type = 2, listcc = []) {
    if(validator.validate(to)){

        let sql = 'default';
        let outsql = 'default';
        let typeClient = 'default';
        let nameClient = 'default';
        let emailout = 'default';
        let id_parent = 'default';

        let host = 'default';
        let port = 'default';
        let user = 'default';
        let pass = 'default';
        let from = 'default';
        let secure = 'default';

        let log = 'default';

        
        sql = `select name, type, emailout, id_parent from client where id = ${client_id}`;
        outsql = await SQL(sql);
        
        nameClient = outsql[0].name;
        typeClient = outsql[0].type;
        emailout = outsql[0].emailout;
        id_parent = outsql[0].id_parent;

        if (typeClient == 1) { // Main
            
            sql = `select * from client_email_setting where id_client = ${client_id} and id_service_type IN(${id_service_type}) and status= 1 ORDER BY id_service_type ASC`;
                         
            log = `Client: ${nameClient} ClientType: Main emailout: Usa su cuenta de correo - The client does not have an email account configured`           
 
        }

        if (typeClient == 2) { // whitelabel            
            
            if (emailout == 1) { // usa su cuenta de email                
                
                sql = `select * from client_email_setting where id_client = ${client_id} and id_service_type IN(${id_service_type}) and status= 1 ORDER BY id_service_type ASC`;
                                 
                log = `Client: ${nameClient} ClientType: Whitelabel emailout: whitelabel su cuenta - The client does not have an email account configured`
                                  
            }
            if (emailout == 2) { // usa cuanta del father                
                
                sql = `select * from client_email_setting where id_client = ${id_parent} and id_service_type in(${id_service_type}) ${id_service_type} and status= 1 ORDER BY id_service_type ASC`;
                                   
                log = `Client: ${nameClient} ClientType: Whitelabel emailout: whitelabel usa cuenta padre - The client FatherID ${id_parent} does not have an email account configured`
                                    
            }
        }     
         
        
        outsql = await SQL(sql);

        if (outsql.length == 0) {
            return [false, log, sql]
        }
        
        if (outsql.length > 1) { // id_service_type = buscado
            
             
            host = outsql[1].host;
            port = outsql[1].port;
            user = outsql[1].username;
            pass = outsql[1].password;
            outsql[1].secure == 1 ? secure = true : secure = false;
        }
         
        if (outsql.length == 1) { // default 
             

            host = outsql[0].host;
            port = outsql[0].port;
            user = outsql[0].username;
            pass = outsql[0].password;
            outsql[0].secure == 1 ? secure = true : secure = false;
        } 
 
        from = user;
        
        
        let transporter = nodemailer.createTransport({
            host,
            port,
            secure, // true for 465, false for other ports
            auth: {
                user, // generated ethereal user
                pass, // generated ethereal password
            },
        });

        
        const mailBody = {
            from,
            to,
            cc:listcc,
            subject,
            html         
        };

        try {
            let out = await transporter.sendMail(mailBody); 
            return[true, out.envelope, {
                host,
                port,
                secure,  
                auth: {
                    user,  
                    pass,  
                },
            }]
        } catch (error) {
            return[false, error, sql,{
                host,
                port,
                secure,  
                auth: {
                    user,  
                    pass,  
                },
            }]
        }

    }else{
        return[false, `Email ${to} format is not valid`]
    }
    
}

async function SendE_mailFile(to, subject, html, file_name, file_dir, client_id, id_service_type = 2, listcc = []) {
    if (validator.validate(to)) {
        
    
        let sql = 'default';
        let outsql = 'default';
        let typeClient = 'default';
        let nameClient = 'default';
        let emailout = 'default';
        let id_parent = 'default';
        let host = 'default';
        let port = 'default';
        let user = 'default';
        let pass = 'default';
        let from = 'default';
        let secure = 'default';
        let tp = 'Master';
        let eout = 'your account';

        let log = 'default';

        
        sql = `select name, type, emailout, id_parent from client where id = ${client_id}`;
        outsql = await SQL(sql);
        nameClient = outsql[0].name;
        typeClient = outsql[0].type;
        emailout = outsql[0].emailout;
        id_parent = outsql[0].id_parent;

        if (typeClient == 1) { // father
            sql = `select * from client_email_setting where id_client = ${client_id} and id_service_type IN(${id_service_type}) and status= 1`;
            outsql = await SQL(sql);

            if (outsql.length == 0) {
                log = `Client:${nameClient} ClientType:${tp} - The client does not have an email account configured`
                return [false, log];
            }

            /*host = outsql[0].host;
            port = outsql[0].port;
            user = outsql[0].username;
            pass = outsql[0].password;
            outsql[0].secure == 1 ? secure = true : secure = false;
            from = user;*/
        }

        if (typeClient == 2) { // whitelabel
            tp = 'whitelabel'
            if (emailout == 1) { // usa su cuenta de email
                sql = `select * from client_email_setting where id_client = ${client_id} and id_service_type IN(${id_service_type}) and status= 1`;
                outsql = await SQL(sql);

                if (outsql.length == 0) {
                    log = `Client:${nameClient} ClientType:${tp} emailout:${eout} - The client does not have an email account configured`
                    return [false, log];
                }

                /*host = outsql[0].host; 
                port = outsql[0].port;
                user = outsql[0].username;
                pass = outsql[0].password;
                outsql[0].secure == 1 ? secure = true : secure = false;
                from = user;*/
            }
            if (emailout == 2) { // usa su cuenta del father
                eout = 'Father'
                sql = `select * from client_email_setting where id_client = ${id_parent} and id_service_type IN(${id_service_type}) and status= 1`;
                outsql = await SQL(sql);

                if (outsql.length == 0) {
                    log = `Client:${nameClient} ClientType:${tp} emailout:${eout} - The client Father ${id_parent} does not have an email account configured`
                    return [false, log];
                }

                /*host = outsql[0].host;
                port = outsql[0].port;
                user = outsql[0].username;
                pass = outsql[0].password;
                outsql[0].secure == 1 ? secure = true : secure = false;
                from = user;*/
            }
        }     

        host = outsql[0].host;
        port = outsql[0].port;
        user = outsql[0].username;
        pass = outsql[0].password;
        outsql[0].secure == 1 ? secure = true : secure = false;
        from = user;
        
        let transporter = nodemailer.createTransport({
            host,
            port,
            secure, // true for 465, false for other ports
            auth: {
            user, // generated ethereal user
            pass, // generated ethereal password
            },
        });

        
        const mailBody = {
            from,
            to,
            cc:listcc,
            subject,
            html,
            attachments: [
                {
                    filename: file_name,
                    path: file_dir,
                }
            ]        
        };

        try {
            let out = await transporter.sendMail(mailBody); 
            return[true, out.envelope]
        } catch (error) {
            return[false, error.response]
        }
    }else{
        return[false, `Email ${to} format is not valid`]
    }
}

async function SendEmailGeneral(to, subject, html, listcc = [], attached_list = []) {
    if(validator.validate(to)){        

        let sql = 'default';

        let host = 'default';
        let port = 'default';
        let user = 'default';
        let pass = 'default';
        let from = 'default';
        let secure = 'default';

        host = 'smtp.gmail.com';
        port = 465;
        user = 'infoacademys1234@gmail.com';
        pass = 'phebophmcupteyka';
        secure = true;
       
        from = user;
        
        let transporter = nodemailer.createTransport({
            host,
            port,
            secure, // true for 465, false for other ports
            auth: {
                user, // generated ethereal user
                pass, // generated ethereal password
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
              },
        });

        let mailBody = {
            from,
            to,
            bcc:listcc,
            subject,
            html         
        };
        
        if (attached_list.length != 0) {

            mailBody = {
                from,
                to,
                cc:listcc,
                subject,
                html,
                attachments: attached_list       
            };
        }        

        try {
            
            let out = await transporter.sendMail(mailBody); 
            
            return[true, out.envelope, {
                host,
                port,
                secure,  
                auth: {
                    user,  
                    pass,  
                },
            }]
        } catch (error) {
            console.log(error);
            return[false, error, sql,{
                host,
                port,
                secure,  
                auth: {
                    user,  
                    pass,  
                },
            }]
        }

    }else{
        return[false, `Email ${to} format is not valid`]
    }
    
}

////////////////////////////////////////////////////////////////////////////
 
function generateRandomStringNumber(num) {
    const characters = '0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result1;
}

function generateRandomString(num) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}

function SQL(sql) {
    return new Promise((resolver, rechazar) => {
        dbconn.query(sql, (error, rows) => {
            if (error) rechazar(error)
            resolver(rows)
        })
    })
}

function EmailformatUser($username, userCode) {
    var msj = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    
    <body style="margin: 0; padding: 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding: 10px 0 30px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                        <tr>
                            <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0px; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;"> <img src="" alt="LOGO" width="130" height="80" style="display: block;" /> </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" style="padding: 40px 30px 40px 40px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="color: #10242b; font-family: ' Times New Roman ', Times, serif; font-size: 18px;"> Dear: <b>'${$username}'</b> </td>
                                    </tr>
                                    <br>
                                    <tr>
                                        <td style="padding: 40px 0 100px 0; color: #10242b; font-family: ' Times New Roman ', Times, serif; font-size: 14px; line-height: 30px;text-indent: 1cm"> Dear User This is your code: ${userCode}  </td>
                                    </tr>
                                    <br>
                                    <br>
                                    <tr>
                                        <td>
                                            <hr>
                                        </td>
                                    </tr>
                                    <br>
                                    <tr>
                                        <td style="padding: 30px 0 20px 0;color: #10242b; font-family: ' Times New Roman ', Times, serif; font-size: 18px;text-indent: 1cm"><br>Estimado (a): <b>'${$username}'</b> </td>
                                    </tr>
                                    <br>
                                    <tr>
                                        <td style="padding: 20px 0 30px 0; color: #10242b; font-family: ' Times New Roman ', Times, serif; font-size: 14px; line-height: 20px;text-indent: 1cm"> Estimado Usuario Este Es su código: ${userCode} </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    
    </html>`

    return msj
}

function Encritar(params) {
    return CryptoJS.AES.encrypt(JSON.stringify(params), config.SECRET_TOKEN).toString();
}

function DesEncritar(params) {
    let bytes = CryptoJS.AES.decrypt(params, config.SECRET_TOKEN);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

async function MakePdf(id, doc) {
    let file_dir = `./pdf/${id}.pdf`;    
        
    const browser = await pupeeteer.launch({
        headless: 'new',
        // `headless: true` (default) enables old Headless;
        // `headless: 'new'` enables new Headless;
        // `headless: false` enables “headful” mode.
      });
    const page = await browser.newPage();

    await page.setContent(doc)
    await page.emulateMediaType('screen')

    /*await page.addStyleTag({
        "content":".tablePDF table {width: 100%;border-spacing: 8px 5px;font-size: 14px;}table#tbl-info-personal {width: 660px;border-spacing: 8px 0px !important;}.elementCenter {margin: 0 auto;}.firma, .text-center, span.upLine {text-align: center;}.header-contract {height: 100px;}.header-contract img {border: 0;height: auto;width: 100%;max-width: 744px;display: block;margin-left: auto;margin-right: auto;}.container-contract {font-size: 14px;font-family: \"Times New Roman\", Times, serif;margin: 10px 10px 10px 20px;max-width: 750px;text-align: justify;line-height: 20px;}.container-contract h1 {font-size: 16px;text-decoration: underline;text-align: center;margin-top: 30px;}.container-contract .dateToday {border-bottom: 1px dashed;}.container-contract span {font-weight: 700;}.container-contract .seccion {background-color: #a9a9a9;padding: 2px;font-size: 14px;}.container-contract ul {list-style: none;margin: 5px 19px 17px;line-height: 1.2;}img.sig_agent {width: 66%;}.agentSing {width: 300px;}#inf-personal input[type=\"text\"] {width: 96%;padding: 7px 11px;margin: 8px 0;border-style: solid;border-radius: 12px;border-color: #a9a9a9;}.div-box, span.upLine {border: 2px solid;}label {width: auto;}span.upLine {padding: 7px;width: 90%;display: block;}@media (min-width: 968px) {.firma {display: flex;justify-content: space-around;text-align: start;align-items: center;}.grid-container {display: grid;grid-template-columns: auto auto auto auto;padding: 5px;}.grid-container > div {background-color: rgba(255, 255, 255, 0.8);text-align: start;font-size: 14px;height: 69px;}.item1 {grid-column: 1/5;}.item13, .item15, .item2 {grid-column: 1/3;}.item14, .item16 {grid-column: 3/5;}.item19 {grid-column: 3/4;}input.txtwidth25 {width: 82%;}input.txtwidth100 {width: 99% !important;}span.upline {width: 96%;}}span.deposit {font-size: 13px;}"
    })*/        

    await  page.pdf({
        "path":file_dir,        
        //"format":"A4",              
        "printBackground":true,
        //"preferCSSPageSize": true,
        //"margin":{ left: '0.5cm', top: '1cm', right: '0.5cm', bottom: '1cm' }
        //"margin":{ left: '0cm', top: '0cm', right: '5cm', bottom: '1cm' }
    })

    await browser.close(); 

    return file_dir
}

async function MakePdfPreview(id, doc) {
    let file_dir = `./src/preview/${id}.pdf`;    
        
    const browser = await pupeeteer.launch({
        headless: 'new',
        // `headless: true` (default) enables old Headless;
        // `headless: 'new'` enables new Headless;
        // `headless: false` enables “headful” mode.
      });
    const page = await browser.newPage();

    await page.setContent(doc)
    await page.emulateMediaType('screen')

    await page.addStyleTag({
        "content":".tablePDF table {width: 100%;border-spacing: 8px 5px;font-size: 14px;}table#tbl-info-personal {width: 660px;border-spacing: 8px 0px !important;}.elementCenter {margin: 0 auto;}.firma, .text-center, span.upLine {text-align: center;}.header-contract {height: 100px;}.header-contract img {border: 0;height: auto;width: 100%;max-width: 744px;display: block;margin-left: auto;margin-right: auto;}.container-contract {font-size: 14px;font-family: \"Times New Roman\", Times, serif;margin: 10px 10px 10px 20px;max-width: 750px;text-align: justify;line-height: 20px;}.container-contract h1 {font-size: 16px;text-decoration: underline;text-align: center;margin-top: 30px;}.container-contract .dateToday {border-bottom: 1px dashed;}.container-contract span {font-weight: 700;}.container-contract .seccion {background-color: #a9a9a9;padding: 2px;font-size: 14px;}.container-contract ul {list-style: none;margin: 5px 19px 17px;line-height: 1.2;}img.sig_agent {width: 66%;}.agentSing {width: 300px;}#inf-personal input[type=\"text\"] {width: 96%;padding: 7px 11px;margin: 8px 0;border-style: solid;border-radius: 12px;border-color: #a9a9a9;}.div-box, span.upLine {border: 2px solid;}label {width: auto;}span.upLine {padding: 7px;width: 90%;display: block;}@media (min-width: 968px) {.firma {display: flex;justify-content: space-around;text-align: start;align-items: center;}.grid-container {display: grid;grid-template-columns: auto auto auto auto;padding: 5px;}.grid-container > div {background-color: rgba(255, 255, 255, 0.8);text-align: start;font-size: 14px;height: 69px;}.item1 {grid-column: 1/5;}.item13, .item15, .item2 {grid-column: 1/3;}.item14, .item16 {grid-column: 3/5;}.item19 {grid-column: 3/4;}input.txtwidth25 {width: 82%;}input.txtwidth100 {width: 99% !important;}span.upline {width: 96%;}}span.deposit {font-size: 13px;}"
    })        

    await  page.pdf({
        "path":file_dir,        
        "format":"A4",              
        "printBackground":true,
        "margin":{ left: '0.5cm', top: '1cm', right: '0.5cm', bottom: '1cm' }
    })

    await browser.close(); 

    return file_dir
}

function FormatNumberPhone(phone) {

    /*
     Esta función toma una cadena como argumento.
     Se utiliza para buscar y reemplazar caracteres en la cadena. La expresión regular  /[^\d]/g  se usa para encontrar todos los caracteres que no son dígitos:
     representa cualquier dígito (0-9).
     dentro de los corchetes  []  indica que queremos lo que no es un dígito.
     es un modificador que significa "global", es decir, reemplazará todas las coincidencias en la cadena, no solo la primera.

     Se reemplazan todos los caracteres no numéricos por una cadena vacía ( '' ), eliminándolos efectivamente.

    */    
               
    phone = phone.replaceAll(" ", ""); // limpia espacio el blanco 
    
    return phone.replace(/[^\d]/g, '');
}

async function getDescendent(idUser) {
  
    let sql = `SELECT id, id_parent FROM
    (SELECT * FROM user ORDER BY id_parent , id) products_sorted,
    (SELECT @pv:='${idUser}') initialisation
        WHERE products_sorted.id = '${idUser}' OR (FIND_IN_SET(id_parent, @pv) > 0 AND @pv:=CONCAT(@pv, ',', id));`;
    let outsql = await SQL(sql);  
    let idChildren = outsql.map(item => item.id); 

    return idChildren
}

function formatearFechaSQL(fecha) {
    // Verificamos si el parámetro es una fecha válida en el formato "mes/día/año"

    const formatos = ['MM/DD/YYYY', 'MM-DD-YYYY'];
    const fechaMoment = moment(fecha, formatos, true)
     
    if (fechaMoment.isValid()) {
        // Si es válida, la formateamos y la devolvemos en "año-mes-día"
        
        return fechaMoment.format('YYYY-MM-DD');
    } else {
        // Si no es válida, devolvemos exactamente lo que recibimos
        return fecha;
    }
}

function EncritarCVV(params) {
    return CryptoJS.AES.encrypt(JSON.stringify(params), 'z5haOnWilIudj4Lj2Zo1nN4bLt00WBF1408SPrNGOp30KWW').toString();
}

function DesEncritarCVV(params) {
    let bytes = CryptoJS.AES.decrypt(params, 'z5haOnWilIudj4Lj2Zo1nN4bLt00WBF1408SPrNGOp30KWW');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

function toCamelCase(arr) {
    return arr.map(obj => {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
                newObj[newKey] = obj[key];
            }
        }
        return newObj;
    });
}

function convertSeconds(segundos) {
    const hours = Math.floor(segundos / 3600); // 1 hora = 3600 segundos
    const minutes = Math.floor((segundos % 3600) / 60); // 1 minuto = 60 segundos
    const secondsRemaining = segundos % 60; // Segundos restantes
    let time = `${minutes}:${secondsRemaining} Min`;
    if(hours > 0){
        time = hours + ':' + minutes + ' Hour';
    }
    if (minutes == 0) {
        time = `${secondsRemaining} Sec`;
    }
    let result = `${time}`
    return { result };
}

module.exports = {
    SendEmail,
    generateRandomString,
    generateRandomStringNumber,
    SQL,
    EmailformatUser,
    Encritar,
    DesEncritar,
    sleep,
    SendEmailFile,
    SendEmailClient,
    SendEmailFileClient,
    SendE_mail,
    SendE_mailFile,
    MakePdf,
    FormatNumberPhone,
    MakePdfPreview,
    SendEmailGeneral,
    getDescendent,
    formatearFechaSQL,
    EncritarCVV,
    DesEncritarCVV,
    toCamelCase,
    convertSeconds
}