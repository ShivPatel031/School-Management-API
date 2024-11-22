const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const mysqlpool = mysql.createPool({
    host:`${process.env.MYSQLHOST}`,
    user:`${process.env.MYSQLUSER}`,
    password:`${process.env.MYSQLPASSWORD}`,
    database:`${process.env.MYSQLDATABASE}`
});

module.exports = mysqlpool;