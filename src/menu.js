const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");

const Department = require("../lib/Department");
const Role = require("../lib/Role");
const Employee = require("../lib/Employee");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "colbywagenbach",
        database: "company_db"
    },
    console.log(`Connected to the company_db database.`)
);

const nextActionQuestion = {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
        "View All Employees",
        "Add An Employee",
        "View All Roles",
        "Add A Role",
        "View All Departments",
        "Add A Department"
    ]
}

const newDepartmentQuestion = {
    type: "input",
    name: "newDepartmentName",
    message: "What is the name of the department?"
};
const newRoleQuestions = [];
const newEmployeeQuestions = [];


// NEXT STEP IS TO ADD IN CONSTRUCTORS AS OPTIONS FOR NEXTACTION.

const Menu = () => {
    inquirer
        .prompt
        (nextActionQuestion)
        .then((nextAction) => {
            switch (nextAction.choice) {
                case "View All Employees":
                    db.query(`SELECT
                            e.id, e.first_name, e.last_name, title, name AS department, salary, concat(m.first_name, " ", m.last_name) AS manager
                            FROM employee e
                            INNER JOIN role ON e.role_id = role.id
                            JOIN department ON role.department_id = department.id
                            LEFT JOIN employee m ON m.id = e.manager_id 
                            ORDER BY e.id ASC`, (req, res) => {
                            console.log("\n")
                            console.table(res)
                    });
                    Menu();
                    break;
                case "Add An Employee":
                    
                    Menu();
                    break;
                case "View All Roles":
                    db.query(`SELECT 
                            role.id, title, name AS department, salary 
                            FROM role
                            JOIN department ON role.department_id = department.id
                            ORDER BY role.id ASC`, (req, res) => {
                            console.log("\n")
                            console.table(res)
                    });
                    Menu();
                    break;
                case "Add A Role":
                    Menu();
                    break;
                case "View All Departments":
                    db.query(`SELECT * FROM department`, (req, res) => {
                        console.log("\n")
                        console.table(res)
                    });
                    Menu();
                    break;
                case "Add A Department":
                    inquirer
                        .prompt
                        (newDepartmentQuestion)
                        .then((newDepartment) => {
                            const {newDepartmentName} = newDepartment;
                            db.query(`INSERT INTO department (name) VALUES (?)`, newDepartmentName, (err, result) => {
                                if (err) {
                                    res.status(400).json({ error: err.mesage });
                                    return;
                                }
                                res.json({
                                    message: "Successfully added a department",
                                    data: body
                                });
                            });
                        });
                    Menu();
                    break;
                default:
                    console.log("Landed at default")
            }
        })
}

module.exports = { Menu };