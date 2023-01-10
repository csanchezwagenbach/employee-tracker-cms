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

// db.query(`SELECT * FROM employee`, (req, res) => {
//     console.log("All employees")
//     console.table(res)
// });

// db.query(`SELECT * FROM role`, (req, res) => {
//     console.log("All roles")
//     console.table(res)
// });

// db.query(`SELECT * FROM department`, (req, res) => {
//     console.log("All departments")
//     console.table(res)
// });

// // DB QUERY FOR "VIEW ALL ROLES"

// db.query(`SELECT 
// role.id, title, name AS department, salary 
// FROM role
// JOIN department ON role.department_id = department.id
// ORDER BY role.id ASC`, (req, res) => {
//     console.table(res)
// });


// // DB QUERY FOR "VIEW ALL EMPLOYEES" 

// db.query(`SELECT
// e.id, e.first_name, e.last_name, title, name AS department, salary, concat(m.first_name, " ", m.last_name) AS manager
// FROM employee e
// INNER JOIN role ON e.role_id = role.id
// JOIN department ON role.department_id = department.id
// LEFT JOIN employee m ON m.id = e.manager_id 
// ORDER BY e.id ASC`, (req, res) => {
//     console.table(res)
// });

NextAction.Menu();







