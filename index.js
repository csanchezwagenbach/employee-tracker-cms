const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");
const NextAction = require("./src/menu");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "colbywagenbach",
        database: "company_db"
    },
    console.log(`Connected to the company_db database.`)
);

NextAction.Menu();







