const fs = require('fs');
const moment = require('moment')
const {SendEmailGeneral} = require('./tools')
const {SQL, MakePdf, FormatNumberPhone} =  require('./tools')
const {dbconn} = require('./db');
const qs = require('querystring');
const axios = require('axios');
const cfg = require('./env');
 
 

async function NotificationsEmailApplicationDV(id_application, id_client, type_template = 1 , source = 'Service:NotificationsEmailApplication') {
    
    try {

        // Consulta datos de la application
        let sql = `SELECT app.id as id_application, app.agreement_number, apt.id as id_applicant, CONCAT_WS(' ', apt.first_name, apt.last_name) as name_applicant, CONCAT_WS('',apt.code_phone , apt.phone) as phone_applicant, apt.email as email_applicant, us.id as id_owner, CONCAT_WS(' ', us.first_name, us.last_name) as name_owner, us.email as email_owner, us.cell as phone_owner, ser.id as id_service, ser.name as name_service,
        apt.address, apt.city, apt.state, apt.zip_code, app.date_sale, app.url_signing, apt.first_name, apt.last_name, app.data_json  FROM application app
        INNER JOIN applicant apt ON app.id_applicant = apt.id 
        INNER JOIN user us ON app.id_user = us.id  
        INNER JOIN plan_price pp ON app.id_plan_price = pp.id 
        INNER JOIN plan p ON pp.id_plan = p.id 
        INNER JOIN service ser ON p.id_service = ser.id  
        WHERE app.id = ${id_application} AND ser.status = 1`
        let outsql = await SQL(sql);

         // return error consulta sql vacia ID application no existe
         if (outsql.length == 0){
            await Application_wizard_log(id_client, id_application, 'EMAIL', 'Invalid ID or Application not active or not valid...!', 'ERROR ID', 2, source);
            return { code: 210, message: 'Service: NotificationsEmailApplication ...!', data: { error: 'Invalid ID or Application not active or not valid...!' } }
        }  

        // datos de la application, user, service, applicant
        let id_applicant = outsql[0].id_applicant;
        let name_applicant = outsql[0].name_applicant;
        let phone_applicant = outsql[0].phone_applicant;
        let email_applicant = outsql[0].email_applicant;
        let id_owner = outsql[0].id_owner;
        let name_owner = outsql[0].name_owner;
        let email_owner = outsql[0].email_owner;
        let phone_owner = outsql[0].phone_owner;
        let id_service = outsql[0].id_service;
        let name_service = outsql[0].name_service;
        let agreement_number = outsql[0].agreement_number;
        let address = outsql[0].address;
        let city = outsql[0].city;
        let state = outsql[0].state;
        let zip_code = outsql[0].zip_code;
        let date_sale = moment(outsql[0].date_sale).format('MM/DD/YYYY, h:mm:ss a');
        let url_signing = outsql[0].url_signing
        let first_name = outsql[0].first_name
        let last_name = outsql[0].last_name

        let dataJson = outsql[0].data_json
        let holder = dataJson.holder
        let preferedLanguage = holder.preferedLanguage

        // se busca informacion para template y el template email

        sql = `SELECT et.*, ht.html_temp  FROM email_template et 
        LEFT JOIN html_template ht ON et.id_html_template = ht.id 
        WHERE et.id_service = ${id_service} AND type_template = ${type_template}`; // template e infor para el template a enviar 
       
        
        outsql = await SQL(sql)

        if (outsql.length == 0) {
            await Application_wizard_log(id_client, id_application, 'EMAIL', `ServiceName: ${name_service} - Agreementnumber: ${agreement_number} - Emailapplicant: ${email_applicant}`, 'The service does not have a base template for EMAIL', 2, source)
            return { code: 210, id_service, message: 'Service: NotificationsEmailApplication ...!', data: { error: `ServiceName: ${name_service}: The service does not have a base template for EMAIL` } }
        }

        let subject_EN_base = outsql[0].subject_EN;
        let subject_ES_base = outsql[0].subject_ES;
        let body_ES_base = outsql[0].body_ES;
        let body_EN_base = outsql[0].body_EN;
        let img_header_base = outsql[0].img_header;
        let img_footer_base = outsql[0].img_footer;
        let id_html_template_base = outsql[0].id_html_template;
        let type_template_base = outsql[0].type_template;
        let email_destinataires_cc_base = outsql[0].email_destinataires_cc

        let send_pdf = outsql[0].send_pdf

        let message_email = outsql[0].html_temp; // template para el email

        let subject = subject_EN_base
        if (preferedLanguage == 'Spanish') {
            message_email = message_email.replaceAll('{message_email}', body_ES_base);   
            subject = subject_ES_base         
        }

        if (preferedLanguage == 'English') {             
            message_email = message_email.replaceAll('{message_email}', body_EN_base);
        }

        message_email = message_email.replaceAll('{img_header_base}', img_header_base);
        message_email = message_email.replaceAll('{img_footer_base}', img_footer_base);
        message_email = message_email.replaceAll('{fullNameApplicant}', name_applicant);
        message_email = message_email.replaceAll('{phone_applicant}', phone_applicant);
        message_email = message_email.replaceAll('{email_applicant}', email_applicant);
        message_email = message_email.replaceAll('{name_owner}', name_owner);
        message_email = message_email.replaceAll('{email_owner}', email_owner);
        message_email = message_email.replaceAll('{phone_owner}', phone_owner);
        message_email = message_email.replaceAll('{name_service}', name_service);
        message_email = message_email.replaceAll('{agreement_number}', agreement_number);
        message_email = message_email.replaceAll('{address}', address);
        message_email = message_email.replaceAll('{city}', city);
        message_email = message_email.replaceAll('{state}', state);
        message_email = message_email.replaceAll('{zip_code}', zip_code);
        message_email = message_email.replaceAll('{date_sale}', date_sale);
        message_email = message_email.replaceAll('{url_signing}', url_signing);
        message_email = message_email.replaceAll('{first_name}', first_name);
        message_email = message_email.replaceAll('{last_name}', last_name);
        message_email = message_email.replaceAll('{body_EN}', body_EN_base);
        message_email = message_email.replaceAll('{body_ES}', body_ES_base);

        
        //  LISTA DE destinatarios
        let list_CC = []
        list_CC.push(email_owner) // agent
        list_CC.push(email_destinataires_cc_base)// viene de DB email_destinataires_cc

        let WSmessage = ''
        let attached_list = []

        if (send_pdf == 1) {

            sql = `SELECT et.*, ht.html_temp  FROM email_template et 
            LEFT JOIN html_template ht ON et.id_html_template = ht.id 
            WHERE et.id_service = ${id_service} AND type_template = 2` // PDF
            outsql = await SQL(sql)

            if (outsql.length == 0) {
                WSmessage = `Service: ${name_service} - attach pdf but does not have a defined template`
            }

            for (let index = 0; index < outsql.length; index++) {
                const element = outsql[index];
                

                let img_header_pdf = element.img_header;
                let img_footer_pdf = element.img_footer;
                let img_card_pdf = element.img_card;
                let subject_pdf = element.subject;
                let body_ES_pdf = element.body_ES;
                let body_EN_pdf = element.body_EN;
                let document_name = element.document_name;
                let id_html_template_pdf = element.id_html_template;
                let type_template_pdf = element.type_template;
                let id = element.id;
                let email_destinataires_cc_pdf = element.email_destinataires_cc
                 
                list_CC.push(email_destinataires_cc_pdf)
                
                let message_pdf = element.html_temp;

                if (preferedLanguage == 'Spanish') {
                    message_pdf = message_pdf.replaceAll('{message_email}', body_ES_pdf);            
                }
        
                if (preferedLanguage == 'English') {             
                    message_pdf = message_pdf.replaceAll('{message_email}', body_EN_pdf);
                }

                message_pdf = message_pdf.replaceAll('{img_header_base}', img_header_pdf);
                message_pdf = message_pdf.replaceAll('{img_footer_base}', img_footer_pdf);
                message_pdf = message_pdf.replaceAll('{fullNameApplicant}', name_applicant);
                message_pdf = message_pdf.replaceAll('{phone_applicant}', phone_applicant);
                message_pdf = message_pdf.replaceAll('{email_applicant}', email_applicant);
                message_pdf = message_pdf.replaceAll('{name_owner}', name_owner);
                message_pdf = message_pdf.replaceAll('{email_owner}', email_owner);
                message_pdf = message_pdf.replaceAll('{phone_owner}', phone_owner);
                message_pdf = message_pdf.replaceAll('{name_service}', name_service);
                message_pdf = message_pdf.replaceAll('{agreement_number}', agreement_number);
                message_pdf = message_pdf.replaceAll('{address}', address);
                message_pdf = message_pdf.replaceAll('{city}', city);
                message_pdf = message_pdf.replaceAll('{state}', state);
                message_pdf = message_pdf.replaceAll('{zip_code}', zip_code);
                message_pdf = message_pdf.replaceAll('{date_sale}', date_sale);
                message_pdf = message_pdf.replaceAll('{url_signing}', url_signing);
                message_pdf = message_pdf.replaceAll('{first_name}', first_name);
                message_pdf = message_pdf.replaceAll('{last_name}', last_name);
                message_pdf = message_pdf.replaceAll('{body_ES}', body_ES_pdf);
                message_pdf = message_pdf.replaceAll('{body_EN}', body_EN_pdf);

                let filename = `${index}_${agreement_number}_${name_applicant}.pdf`;                

                let path = await MakePdf(`${id}_${index}`, message_pdf);
                
                attached_list.push({filename, path, contentType: 'application/pdf'})
            }            
            
        }             

        let outemail = await SendEmailGeneral(email_applicant, subject, message_email, id_client, list_CC, attached_list)

        send_pdf = send_pdf == 1 ? true : false

        if (outemail[0] == true) {
            ClearPDf(attached_list)
            WSmessage = 'Email sent successfully...!'
            await Application_wizard_log(id_client, id_application, 'EMAIL', `${WSmessage} - ServiceName: ${name_service} - Agreementnumber: ${agreement_number} - Emailapplicant: ${email_applicant}`, '', 1, source)
            return {code:200, message:"NotificationsEmailApplication", id_application, id_service, send_pdf, outemail:outemail[1], WSmessage}
        }

        if (outemail[0] == false) {
            ClearPDf(attached_list)
            WSmessage = `Mail sending problem...!`
            await Application_wizard_log(id_client, id_application, 'EMAIL', `${WSmessage} - ServiceName: ${name_service} - Agreementnumber: ${agreement_number} - Emailapplicant: ${email_applicant}`, outemail[1], 2, source)
            return {code:210, message:"NotificationsEmailApplication", id_application, id_service, send_pdf, outemail:outemail[1], WSmessage}
        }
       

    } catch (error) {       
        return({ code: 400, message: 'Sql Errors', error:error });
    }
}

async function Application_wizard_log(idClient, id_application, type, log_descrip, error, flag, source) {
    let sql = `INSERT INTO application_wizard_log(id_client, id_application, type, log_descriptions, error, date, flag, source, createdAt, updatedAt)
    VALUES(${idClient}, ${id_application}, '${type}', '${log_descrip}', '${error}', CURRENT_TIMESTAMP, ${flag}, '${source}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;
     
    await SQL(sql);
} 

function ClearPDf(list) {
   if (list.length != 0) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (fs.existsSync(element.path)) {
                fs.unlinkSync(element.path);
            }         
        }
    }
}

async function NotificationsSMSApplicationDV(id_client, id_application, message_send_txt, name, lastName, phone, service_type) {   

    let sms_msj = `Send Notification: ${name} ${lastName} - ${phone}` 
    
    if (outsend[0] == true) {
        await Application_wizard_log(id_client, id_application, 'SMS', sms_msj, '', 1, 'Service: NotificationsSMSApplication')
    }

    if (outsend[0] == false) {
        let err = outsend[1].replaceAll("'","")       
        await Application_wizard_log(id_client, id_application, 'SMS', sms_msj, err, 2, 'Service: NotificationsSMSApplication')
    }

    return  outsend;
}

async function SendEmailNotificationPayment(name_applicant, agreement_number, payment_date, id_service, template, email_applicant, source, id_client, id_application, days = '') {
    let sql = '';
    let message = '';
    let nota = '';
    let outemail = 'default';
    
    let subject = 'Información sobre su pago correspondiente a la fecha {FechaIntentoPago}'

    payment_date = moment(payment_date).format('MM/DD/YYYY');

    if (template == 4) { // Suspendido

        sql = `SELECT * FROM cronjob_notification_email cne WHERE cne.id  = 1`;
        nota = 'Payment Suspended'

    }

    if (template == 3) { // Falla

        sql = `SELECT * FROM cronjob_notification_email cne WHERE cne.id  = 2`
        nota = 'Payment Failed'

    }

    if (template == 5) { // notice of payment

        sql = `SELECT * FROM cronjob_notification_email cne WHERE cne.id  = 3`
        nota = 'Notice Of Payment'

    }

    if (template == 6) { // Payment canceled

        sql = `SELECT * FROM cronjob_notification_email cne WHERE cne.id  = 4`
        nota = 'Payment Canceled'

    }

    if (template < 3 || template > 6) {
        let out = [false, `Template type: ${template} is not valid...!`];
        return out;
    }

    let outsql = await SQL(sql);
    
    
    if(outsql.length == 0){        
         
        Application_wizard_log(id_client, id_application, 'Email', `You do not have an email template to send...!`, `sendEmailNotificationPayment Type: ${nota} `, 2, source);    
        let out = [false, 'You do not have an email template to send...!'];
        return out;
    }
     
    if (outsql.length != 0) {

        message = outsql[0].html_temp;

        sql = `SELECT c.name as name_client, c.phone_notification_template, c.url_logo FROM service s 
        inner join client c ON s.id_client = c.id 
        WHERE s.id  = ${id_service} `

        outsql = await SQL(sql)
        
        let phone_notification_template = outsql[0].phone_notification_template;
        let logo_client = outsql[0].url_logo;
        let name_client = outsql[0].name_client;

        message = message.replaceAll('{NombreCompletoAplicante}', name_applicant);
        message = message.replaceAll('{FechaIntentoPago}', payment_date);
        message = message.replaceAll('{days}', days);
        message = message.replaceAll('{agreementNumber}', agreement_number);
        message = message.replaceAll('{phone_notification_template}', phone_notification_template);
        message = message.replaceAll('{logo_client}', logo_client);
        message = message.replaceAll('{name_client}', name_client)

        subject = subject.replaceAll('{FechaIntentoPago}', payment_date);

        let list_cc = []
        list_cc.push('joesquintero2014@gmail.com')

        outemail = await SendEmailGeneral(email_applicant, subject, message, id_client, list_cc, []);

        if (outemail[0] == true) {
            // log            
            let obj  = outemail[1];

            let msj = `Send - From: ${obj.from}, To: ${obj.to[0]}  - ${nota}`;           
          
            Application_wizard_log(id_client, id_application, 'EMAIL', msj, 'OK Send Email!', 1, source);
        }
        if (outemail[0] == false) {
            // log
            let msj = JSON.stringify(outemail[1]) + ` ApplicantEmail: ${email_applicant} - ${nota} `;
            Application_wizard_log(id_client, id_application, 'EMAIL', msj, 'NO Send Email!', 2, source);
        }
        return outemail;
    }

}

async function SendDataAPI(id_application) {    
 
    let token = await getTokenCareington();

    if (token != null) {
        let sql = `SELECT app.id as id_application, app.agreement_number, apt.id as id_applicant, CONCAT_WS(' ', apt.first_name, apt.last_name) as name_applicant, CONCAT_WS('',apt.code_phone , apt.phone) as phone_applicant, apt.email as email_applicant, us.id as id_owner, CONCAT_WS(' ', us.first_name, us.last_name) as name_owner, us.email as email_owner, us.cell as phone_owner, ser.id as id_service, ser.name as name_service,
        apt.address, apt.city, apt.state, apt.zip_code, app.date_sale, app.url_signing, apt.first_name, apt.last_name, app.data_json, ser.id_client, apt.phone as phone_for_the_api, ser.group_code FROM application app
        INNER JOIN applicant apt ON app.id_applicant = apt.id 
        INNER JOIN user us ON app.id_user = us.id  
        INNER JOIN plan_price pp ON app.id_plan_price = pp.id 
        INNER JOIN plan p ON pp.id_plan = p.id 
        INNER JOIN service ser ON p.id_service = ser.id  
        WHERE app.id = ${id_application} AND ser.status = 1 AND app.transferred = 0`

        let outsql = await SQL(sql)      
 
        

        if (outsql.length == 0) {
            return { code:210, message:'The data has already been transferred....!', data:outsql}
        }

        let group_code = outsql[0].group_code

        let id_client = outsql[0].id_client

        let data_json = outsql[0].data_json // json de tabla application

        let holder = data_json.holder 

        let dependentsDataList = [];

        if (data_json.dependent.totalShow > 0) {
            dependentsDataList = data_json.dependent.dependents // lista de dependientes del json de tabla application
        }

        let dataSql = outsql

        let lang = 'EN'
        if(holder.preferedLanguage == 'Spanish') lang = 'SP'

        let id_state = holder.state

        sql = `select state_code from states where id = ${id_state}`
        outsql = await SQL(sql)

        let state_code = 'AK'
        if(outsql.length != 0) state_code = outsql[0].state_code
      
        //console.log(holder); return       

        //console.log(dependentsDataList); return

        // Values can be one of the following ['C','D','S','O'].
        // C -> Child, D -> Dependent, S -> Spouse, O -> Others        
        let Relationship = {
            '1':'S',
            '2':'D',
            '3':'C',
            '4':'O'
        }        

        // Gender can be ['M', 'F', 'O']
        const Genders = {
            'Male':'M',
            'Female':'F',
            'Other':'O'
        };     

         
        let List = [] // lista final de dependientes

        // CoverageType can be['M','MD','MC','MS','MF']
        // M -> Member Only, MC -> Member + Child, MD -> Member + Dependent, MS -> Member + Spouse, MF -> Member + Family.
        let coverageType = 'M'

        let hasAWife= 0 
        let haveDependents = 0 


        if (dependentsDataList.length != 0) { // hay dependientes
            for (let index = 0; index < dependentsDataList.length; index++) {
                const element = dependentsDataList[index];

                if (element.relationship == 1) { // tiene esposa
                    hasAWife = 1
                }

                if (element.relationship == 2) { // tiene un dependiente
                    haveDependents = 1
                }
                
                List.push({
                    externalDependentId:index,
                    firstName:quitarTildes(element.name),
                    gender:Genders[element.gender],
                    lastName:quitarTildes(element.lastName),
                    dateOfBirth:element.birthdate,
                    relationshipCode:Relationship[element.relationship],
                    CoverageStartDate:dataSql[0].date_sale                     
                })
                
            }
        }         
        
        if (hasAWife == 1) { //MS -> Member + Spouse
            coverageType = 'MS'
        }

        if ((hasAWife == 0 && haveDependents == 1) || (hasAWife == 1 && haveDependents == 1)) { // MF -> Member + Family
            coverageType = 'MF'
        }  
                   
        
        
        let phone = FormatNumberPhone(dataSql[0].phone_for_the_api) // limpia el formato del TEL

             
        // OBJ A enviar AL API
        const data = {
            firstName: quitarTildes(dataSql[0].first_name),
            lastName: quitarTildes(dataSql[0].last_name),
            dateOfBirth: holder.birthdate,
            email: dataSql[0].email_applicant,
            phones: [
                {
                    phoneType: "Mobile",
                    phoneNumber:  phone  
                }
            ],
            policyNumber: dataSql[0].agreement_number,  
            groupCode: group_code,
            address: {
                address1: quitarTildes(holder.address),
                address2: quitarTildes(holder.address2),
                city: quitarTildes(holder.city),
                stateCode: state_code,
                zipCode: holder.zipCode
            },
            coverageType: coverageType,
            coverageStartDate: dataSql[0].date_sale,
            language: lang,
            dependents:List
        };


        //console.log(data); return 
        
        // OBJ A enviar AL API     

       return await sendDataCareington(id_client, id_application, token, data)

        
    }   

    return { code:210, message:'ERROR TOKEN ....!', data:[]}
} 
async function sendDataCareington(id_client, id_application, token, data) {
    const url = cfg.URL_SEND; // DEV
    
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/2023.5.8'
            }
        });

        //console.log('Success:', response.data); // Maneja la respuesta exitosa
        Application_wizard_log(id_client, id_application,  'SendDataAPI','Transferred data', '', 1, 'sendDataCareington' )
        let sql = `update application set transferred = 1 where id = ${id_application}`
        await SQL(sql)

        await Sent_data_details(id_application, data) // guarda detalle de envio al API

        return { code:200, message:'Data transferred successfully....!', data}
    } catch (error) {
        if (error.response) {         
           // console.log(error.status);
            if(error.status == 422){ // ERROR Validations

                var list_err = []
                let valores = Object.values(error.response.data.errors); // OBJ lista de errores de validacion
               
                for(let i=0; i< valores.length; i++){
                    //console.log(valores[i][0]);
                    //list_err.concat(valores[i][0] )
                    list_err.push(valores[i][0])
                    
                }                  
                
                Application_wizard_log(id_client, id_application,  'SendDataAPI','ERROR Validator', list_err.toString(), 2, 'sendDataCareington' )
            } // ERROR Validations
            
            //console.error('1-Error:', error.response.data); // Maneja el error
            return { code:210, message:'ERROR Data transferred ....!', data:list_err.toString(), obj:data}
        } else {
            //console.error('2-Error:', error.message);
        }
    }
}
async function Sent_data_details(id_application, data, type = 'new') {     
    
    try {
        let sql = `INSERT INTO sent_data_api_details
        (id_application, id_parent, first_name, last_name, date_of_birth, email, phone, policy_number, group_code, address, city, state_code, zip_code, coverage_type, language, gender, relationship_code, coverage_start_date, type)
        VALUES(${id_application}, 0, '${data.firstName}', '${data.lastName}', '${data.dateOfBirth}', '${data.email}', '${data.phones[0].phoneNumber}', '${data.policyNumber}', '${data.groupCode}', '${data.address.address1}', '${data.address.city}', '${data.address.stateCode}', '${data.address.zipCode}','${data.coverageType}', '${data.language}', '', 'Member', '${data.coverageStartDate}', '${type}');`
        
        let outsql = await SQL(sql)

        let insertId = outsql.insertId;

    
        let List = data.dependents
    

        // Values can be one of the following ['C','D','S','O'].
        // C -> Child, D -> Dependent, S -> Spouse, O -> Others
        let RelationshipCode = {
            'S':'Spouse',
            'D':'Dependent',
            'C':'Child',
            'O':'Others'
        }
        if (List.length != 0) {
            for (let index = 0; index < List.length; index++) {
                const element = List[index];
                
                sql = `INSERT INTO sent_data_api_details
                (id_application, id_parent, first_name, last_name, date_of_birth, gender, relationship_code, coverage_start_date)
                VALUES(${id_application}, ${insertId}, '${element.firstName}', '${element.lastName}', '${element.dateOfBirth}', '${element.gender}', '${RelationshipCode[element.relationshipCode]}', '${element.CoverageStartDate}');`
                            
                await SQL(sql)
            }
        }
    } catch (error) {
        console.log(error);
        
    }
}

async function SendEmailCredentials(id_user, idClient, method='user') {
    
    let sql =''
    if(method == 'user') sql = `SELECT * FROM user where id = ${id_user}`;
    if(method == 'contract') sql = `SELECT * FROM user where id_contract_applicant = ${id_user}`;

    let outsql = await SQL(sql);

    let name_agent = outsql[0].first_name + ' ' + outsql[0].last_name;
    let email_agent = outsql[0].email;
    let username = outsql[0].username;
    let password = outsql[0].password;
    let flagEmailWelcomeSend = outsql[0].flag_email_welcome_send; 

    var user_prefered_Language  = outsql[0].user_prefered_Language;

    let id_html_template = 4    
    let subject_base = 'Welcome Agent';
    if(user_prefered_Language == 'es') {
        id_html_template = 5
        subject_base = 'Bienvenido Agente';
    }
  
    
    if(flagEmailWelcomeSend == 1){

        sql = `SELECT * FROM html_template WHERE id = ${id_html_template}`; // carta de bienvenida
        outsql = await SQL(sql); 
        
        if (outsql.length == 0) return {code:210, message:'sendemailagent', data:'The Client does not have a defined email template'} 
        
       
        message_email = outsql[0].html_temp;

        message_email = message_email.replaceAll('{NombreCompletoAgent}', name_agent);
        message_email = message_email.replaceAll('{username}', username);
        message_email = message_email.replaceAll('{password}', password);            
        
        
        outemailApplicant = await SendEmailGeneral(email_agent, subject_base, message_email, idClient, [], []);   

        if(outemailApplicant[0] == true){ // OK 
            if (method == 'user') {
                sql = `UPDATE user set flag_email_welcome_send = 2 where id = ${id_user} `;
                await SQL(sql);
            }
            return {code:200, message:'Email Sent Successfully', idClient, email_agent, user_prefered_Language, Email:outemailApplicant[1]};
        }    
        if(outemailApplicant[0] == false){ // ERROR Envio 
            return {code:210, message:'Error Sending Email', idClient, email_agent, user_prefered_Language, Email:outemailApplicant[1]};             
        }
    }
    else {
        return {code: 200, message:'The email has already been sent to the agent previously'}
    }
}

async function SendEmailPassword(idUser) {   
    let sql = `SELECT email, otp FROM user where id = ${idUser}`;
    let outsql = await SQL(sql);

    let email = outsql[0].email;
    let otp = outsql[0].otp; 
    let subject_base = 'Asunto: ¡Clave temporal!';
       
    message_email = `
                <!DOCTYPE html>
            <html lang="en" xmlns="https://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <meta name="x-apple-disable-message-reformatting">
                <title></title>
                <!--[if mso]><noscript><xml><o:officedocumentsettings><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings></xml></noscript><![endif]-->
                <style>
                    div,h1,p,table,td{font-family:Arial,sans-serif}.ql-align-justify{text-align:justify}.ql-align-center{text-align:center}.footNote{font-size:12px}.primary-font{font-size:14px}.secodary-font{font-size:16px}.fcc-btn{background-color:#f7f7f7;color:#0fc7c9;padding:10px 20px;border:5px solid #0fc7c9;border-radius:5px;text-decoration:none;font-size:16px;font-weight:700}.color-background{background-color:#f7f7f7}
                </style>
            </head>
            
            <body style="margin:0;padding:0">
                <table role="presentation" style="margin-top:120px;width:100%;border-collapse:collapse;border:0;border-spacing:0">
                    <tr>
                        <td align="center" style="padding:0">
                            <table role="presentation" class="color-background" style="width:602px;border-collapse:collapse;border:1px solid #ccc;border-spacing:0;text-align:left">
                                <tr>
                                    <td align="center" style="padding:5px"><img src="imagen" alt="" width="120px" style="height:auto;display:block"></td>
                                </tr>
                                <tr>
                                    <td style="padding:16px 30px 42px 30px">
                                        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0">
                                            <tr>
                                                <td class="ql-align-justify">
                                                    <h3>Hola {email}</h3>
                                                    <br>
                                                    <h3> Nuestro sistema se enfoca en que nuestros usuarios tengan la mejor seguridad</h3>
                                                    <br>
                                                    <br>
                                                    <div style="text-align:center">
                                                        <p class="secodary-font"><b>Tu Clave temporal es :</b>{otp}</p>
                                                    <br>
                                                    <br>
                                                    <p class="footNote ql-align-center"> Si no has solicitado esto, por favor ignora este correo electrónico. </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            
            </html>`;

    message_email = message_email.replaceAll('{otp}', otp);    
    message_email = message_email.replaceAll('{email}', email);    
    
    outemail = await SendEmailGeneral(email, subject_base, message_email, [], []); 

    if(outemail[0] == true){ // OK 
        return {code:200, message:'Email Send Successfully', email, Email:outemail[1]};
    }    
    if(outemail[0] == false){ // ERROR Envio 
        return {code:210, message:'Error Sending Email', email, Email:outemail[1]};             
    }
}

async function SendDataUpdateAPI(id_application) {    
 
    let token = await getTokenCareington();

    if (token != null) {
        let sql = `SELECT app.id as id_application, app.agreement_number, apt.id as id_applicant, CONCAT_WS(' ', apt.first_name, apt.last_name) as name_applicant, CONCAT_WS('',apt.code_phone , apt.phone) as phone_applicant, apt.email as email_applicant, us.id as id_owner, CONCAT_WS(' ', us.first_name, us.last_name) as name_owner, us.email as email_owner, us.cell as phone_owner, ser.id as id_service, ser.name as name_service,
        apt.address, apt.city, apt.state, apt.zip_code, app.date_sale, app.url_signing, apt.first_name, apt.last_name, app.data_json, ser.id_client, apt.phone as phone_for_the_api, ser.group_code FROM application app
        INNER JOIN applicant apt ON app.id_applicant = apt.id 
        INNER JOIN user us ON app.id_user = us.id  
        INNER JOIN plan_price pp ON app.id_plan_price = pp.id 
        INNER JOIN plan p ON pp.id_plan = p.id 
        INNER JOIN service ser ON p.id_service = ser.id  
        WHERE app.id = ${id_application} AND ser.status = 1`   
       // console.log(sql);
             
        let outsql = await SQL(sql)              

        if (outsql.length == 0) {
            return { code:210, message:'The data has already been transferred....!', data:outsql}
        }

        let group_code = outsql[0].group_code

        let agreement_number = outsql[0].agreement_number

        let id_client = outsql[0].id_client

        let data_json = outsql[0].data_json // json de tabla application

        let holder = data_json.holder 

        let dependentsDataList = [];

        if (data_json.dependent.totalShow > 0) {
            dependentsDataList = data_json.dependent.dependents // lista de dependientes del json de tabla application
        }

        let dataSql = outsql

        let lang = 'EN'
        if(holder.preferedLanguage == 'Spanish') lang = 'SP'

        let id_state = holder.state

        sql = `select state_code from states where id = ${id_state}`
        outsql = await SQL(sql)

        let state_code = 'AK'
        if(outsql.length != 0) state_code = outsql[0].state_code
      
        //console.log(holder); return       

        //console.log(dependentsDataList); return

        // Values can be one of the following ['C','D','S','O'].
        // C -> Child, D -> Dependent, S -> Spouse, O -> Others        
        let Relationship = {
            '1':'S',
            '2':'D',
            '3':'C',
            '4':'O'
        }        

        // Gender can be ['M', 'F', 'O']
        const Genders = {
            'Male':'M',
            'Female':'F',
            'Other':'O'
        };     

         
        let List = [] // lista final de dependientes

        // CoverageType can be['M','MD','MC','MS','MF']
        // M -> Member Only, MC -> Member + Child, MD -> Member + Dependent, MS -> Member + Spouse, MF -> Member + Family.
        let coverageType = 'M'

        let hasAWife= 0 
        let haveDependents = 0 

        /*
        if (dependentsDataList.length != 0) { // hay dependientes
            for (let index = 0; index < dependentsDataList.length; index++) {
                const element = dependentsDataList[index];

                if (element.relationship == 1) { // tiene esposa
                    hasAWife = 1
                }

                if (element.relationship == 2) { // tiene un dependiente
                    haveDependents = 1
                }
                
                List.push({
                    externalDependentId:index,
                    firstName:quitarTildes(element.name),
                    gender:Genders[element.gender],
                    lastName:quitarTildes(element.lastName),
                    dateOfBirth:element.birthdate,
                    relationshipCode:Relationship[element.relationship],
                    CoverageStartDate:dataSql[0].date_sale                     
                })
                
            }
        }
        */         
        
        if (hasAWife == 1) { //MS -> Member + Spouse
            coverageType = 'MS'
        }

        if ((hasAWife == 0 && haveDependents == 1) || (hasAWife == 1 && haveDependents == 1)) { // MF -> Member + Family
            coverageType = 'MF'
        }  
                   
        
        
        let phone = FormatNumberPhone(dataSql[0].phone_for_the_api) // limpia el formato del TEL

             
        // OBJ A enviar AL API
        const data = {
            firstName: quitarTildes(dataSql[0].first_name),
            lastName: quitarTildes(dataSql[0].last_name),
            dateOfBirth: holder.birthdate,
            email: dataSql[0].email_applicant,
            phones: [
                {
                    phoneType: "Mobile",
                    phoneNumber:  phone  
                }
            ],
            //policyNumber: dataSql[0].agreement_number,  
            //groupCode: group_code,
            address: {
                address1: quitarTildes(holder.address),
                address2: quitarTildes(holder.address2),
                city: quitarTildes(holder.city),
                stateCode: state_code,
                zipCode: holder.zipCode
            },
            //coverageType: coverageType,
            //coverageStartDate: dataSql[0].date_sale,
            language: lang,
            //dependents:List
        };


        //console.log(data); return 
        
        // OBJ A enviar AL API     

       return await sendDataUpdateCareington(group_code, agreement_number, id_client, id_application, token, data)

        
    }   

    return { code:210, message:'ERROR TOKEN ....!', data:[]}
} 
async function sendDataUpdateCareington(group_code, agreement_number, id_client, id_application, token, data) {
    const url = cfg.URL_SEND+'/'+group_code+'/'+agreement_number;      
    console.log(url);
    
    try {
        const response = await axios.put(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/2023.5.8'
            }
        });

        //console.log('Success:', response.data); // Maneja la respuesta exitosa
        Application_wizard_log(id_client, id_application,  'SendDataAPI','Update Transferred data', '', 1, 'sendDataUpdateCareington' )        

        await Sent_data_details_holder(id_application, data, 'update') // guarda detalle de envio al API

        return { code:200, message:'Data transferred successfully....!', data}
    } catch (error) {
        if (error.response) {         
            //console.log(error.status); return
            var list_err = []

            if(error.status == 404){ // ERROR not Found

                list_err.push(`Not Found: ${group_code} / ${agreement_number}`)
                           
                
                Application_wizard_log(id_client, id_application,  'Update SendDataAPI','ERROR Validator', list_err.toString(), 2, 'sendDataUpdateCareington' )
            } // ERROR not Found
            if(error.status == 422){ // ERROR Validations

                 
                let valores = Object.values(error.response.data.errors); // OBJ lista de errores de validacion
               
                for(let i=0; i< valores.length; i++){
                    //console.log(valores[i][0]);
                    //list_err.concat(valores[i][0] )
                    list_err.push(valores[i][0])
                    
                }                  
                
                Application_wizard_log(id_client, id_application,  'Update SendDataAPI','ERROR Validator', list_err.toString(), 2, 'sendDataUpdateCareington' )
            } // ERROR Validations
            
            //console.error('1-Error:', error.response.data); // Maneja el error
            return { code:210, message:'ERROR Data transferred ....!', data:list_err.toString(), obj:data}
        } else {
            //console.error('2-Error:', error.message);
        }
    }
}
async function Sent_data_details_holder(id_application, data, type = 'update') {     
    
    try {
        let sql = `INSERT INTO sent_data_api_details
        (id_application, id_parent, first_name, last_name, date_of_birth, email, phone, policy_number, group_code, address, city, state_code, zip_code, coverage_type, language, gender, relationship_code, coverage_start_date, type)
        VALUES(${id_application}, 0, '${data.firstName}', '${data.lastName}', '${data.dateOfBirth}', '${data.email}', '${data.phones[0].phoneNumber}', '${data.policyNumber}', '${data.groupCode}', '${data.address.address1}', '${data.address.city}', '${data.address.stateCode}', '${data.address.zipCode}','${data.coverageType}', '${data.language}', '', 'Member', '${data.coverageStartDate}', '${type}');`
        
        let outsql = await SQL(sql)
 
    } catch (error) {
        console.log(error);
        
    }
}
 
async function SendDataUpdateDependentAPI(id_application, positionArray, name, lastName, relationship,  gender,  birthdate ) {    
     
    
    let token = await getTokenCareington();

    if (token != null) {
        let sql = `SELECT app.id as id_application, app.agreement_number, apt.id as id_applicant, CONCAT_WS(' ', apt.first_name, apt.last_name) as name_applicant, CONCAT_WS('',apt.code_phone , apt.phone) as phone_applicant, apt.email as email_applicant, us.id as id_owner, CONCAT_WS(' ', us.first_name, us.last_name) as name_owner, us.email as email_owner, us.cell as phone_owner, ser.id as id_service, ser.name as name_service,
        apt.address, apt.city, apt.state, apt.zip_code, app.date_sale, app.url_signing, apt.first_name, apt.last_name, app.data_json, ser.id_client, apt.phone as phone_for_the_api, ser.group_code FROM application app
        INNER JOIN applicant apt ON app.id_applicant = apt.id 
        INNER JOIN user us ON app.id_user = us.id  
        INNER JOIN plan_price pp ON app.id_plan_price = pp.id 
        INNER JOIN plan p ON pp.id_plan = p.id 
        INNER JOIN service ser ON p.id_service = ser.id  
        WHERE app.id = ${id_application} AND ser.status = 1`   
        
             
        let outsql = await SQL(sql)              

        if (outsql.length == 0) {
            return { code:210, message:'The data has already been transferred....!', data:outsql}
        }

        let group_code = outsql[0].group_code

        let agreement_number = outsql[0].agreement_number

        let id_client = outsql[0].id_client
         

        // Values can be one of the following ['C','D','S','O'].
        // C -> Child, D -> Dependent, S -> Spouse, O -> Others        
        let Relationship = {
            '1':'S',
            '2':'D',
            '3':'C',
            '4':'O'
        }        

        // Gender can be ['M', 'F', 'O']
        const Genders = {
            'Male':'M',
            'Female':'F',
            'Other':'O'
        };     

        
        // OBJ A enviar AL API
        const data = [
            {
                externalDependentId:positionArray,
                firstName:quitarTildes(name),
                gender:Genders[gender],
                lastName:quitarTildes(lastName),
                dateOfBirth:birthdate,
                relationshipCode:Relationship[relationship]                                      
            }
        ];


        //console.log(data); return 
        
        // OBJ A enviar AL API     

       return await sendDataUpdateDependentCareington(group_code, agreement_number, id_client, id_application, token, data)

        
    }   

    return { code:210, message:'ERROR TOKEN ....!', data:[]}
}
async function sendDataUpdateDependentCareington(group_code, agreement_number, id_client, id_application, token, data) {
    const url = cfg.URL_SEND_UPDATE_DEPENDENT+'/'+group_code+'/'+agreement_number+'/dependents';      
    
   data = JSON.stringify(data)    
   
    try {
        const response = await axios.put(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/2023.5.8'
            }
        });

        //console.log('Success:', response.data); // Maneja la respuesta exitosa
        Application_wizard_log(id_client, id_application,  'SendDataAPI','Update Dependent Transferred data', '', 1, 'sendDataUpdateDependentCareington' )        

        await Sent_data_details_dependent(id_application, data) // guarda detalle de envio al API

        return { code:200, message:'Data transferred successfully....!', data}
    } catch (error) {
        if (error.response) {         
            //console.log(error.status); return
            var list_err = []

            if(error.status == 404){ // ERROR Validations

                list_err.push(`Not Found: ${group_code} / ${agreement_number} /dependents`)
                           
                
                Application_wizard_log(id_client, id_application,  'Update Dependent SendDataAPI','ERROR Validator', list_err.toString(), 2, 'sendDataUpdateCareington' )
            } // ERROR Validations
            if(error.status == 422){ // ERROR Validations

                
                let valores = Object.values(error.response.data.errors); // OBJ lista de errores de validacion
               
                for(let i=0; i< valores.length; i++){
                    //console.log(valores[i][0]);
                    //list_err.concat(valores[i][0] )
                    list_err.push(valores[i][0])
                    
                }                  
                
                Application_wizard_log(id_client, id_application,  'Update Dependent SendDataAPI','ERROR Validator', list_err.toString(), 2, 'sendDataUpdateDependentCareington' )
            }
            
            //console.error('1-Error:', error.response.data); // Maneja el error
            return { code:210, message:'ERROR Data transferred ....!', data:list_err.toString(), obj:data}
        } else {
            //console.error('2-Error:', error.message);
        }
    }
}
async function Sent_data_details_dependent(id_application, data, type = 'update dependent') {    
     
    data = JSON.parse(data)
    
    /*
    {
        externalDependentId:positionArray,
        firstName:quitarTildes(name),
        gender:Genders[gender],
        lastName:quitarTildes(lastName),
        dateOfBirth:birthdate,
        relationshipCode:Relationship[relationship]                                      
    }
    */
    
    try {
        let sql = `INSERT INTO sent_data_api_details
        (id_application, id_parent, first_name, last_name, date_of_birth, gender, relationship_code, type)
        VALUES(${id_application}, 0, '${data[0].firstName}', '${data[0].lastName}', '${data[0].dateOfBirth}', '${data[0].gender}', '${data[0].relationshipCode}', '${type}');`
        
        let outsql = await SQL(sql)
 
    } catch (error) {
        console.log(error);
        
    }
}
 
////////////////////////////////////
async function getTokenCareington() {
    const url = cfg.URL_LOGIN; // DEV

    const data = {
        client_secret: cfg.CLIENT_SECRET,
        client_id: cfg.CLIENT_ID,
        scope: cfg.SCOPE,
        grant_type: cfg.GRANT_TYPE
    };

     
    try {
        const response = await axios.post(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'insomnia/2023.5.8',
                'Cookie': 'fpc=AuK6i2PX5EFOmEN0pU58ctHhG5UXAQAAAH0ltN4OAAAA; x-ms-gateway-slice=estsfd; stsservicecookie=estsfd'
            }
        });
        
        //console.log('Success:', response.data); // Maneja la respuesta exitosa
        return response.data.access_token
    } catch (error) {
        if (error.response) {
           // console.error('1-Error:', error.response.data); // Maneja el error
            return null
        } else {
            //console.error('2-Error:', error.message);
            return null
        }
    }
}
function quitarTildes(cadena) {
    return cadena
        .normalize('NFD') // Normaliza la cadena a una forma que separa los caracteres acentuados de sus tildes
        .replace(/[\u0300-\u036f]/g, ''); // Elimina los caracteres de acento (tildes)
}
///////////////////////////////////
 
module.exports = {
    NotificationsEmailApplicationDV,
    Application_wizard_log,
    ClearPDf,
    NotificationsSMSApplicationDV,
    SendEmailNotificationPayment,
    SendDataAPI,
    SendEmailCredentials,
    Sent_data_details,
    SendEmailPassword,
    SendDataUpdateAPI,
    SendDataUpdateDependentAPI
}