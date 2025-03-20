const mysql = require('mysql2')
const cfg = require("./env");

const objectConnection = {
  host: cfg.DBHOST,
  port: cfg.DBPORT,
  user: cfg.DBUSER,
  password: cfg.DBPASSWORD,
  database: cfg.DATABASE,
  charset : cfg.DBCHARTSET
}
 
/*
const objectConnectionCRM = {
  host: cfg.CRM_DBHOST,
  port: cfg.CRM_DBPORT,
  user: cfg.CRM_DBUSER,
  password: cfg.CRM_DBPASSWORD,
  database: cfg.CRM_DBDATABASE,
  charset : cfg.CRM_DBCHARTSET
}
  */
 
const dbconn = mysql.createConnection(objectConnection) 

//const dbconnCRM = mysql.createConnection(objectConnectionCRM)  
let dbconnCRM = null

module.exports = {dbconn,dbconnCRM}