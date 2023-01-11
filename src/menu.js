const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");

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

let departments = [];
let departmentIDS = [];

let allDepartmentsObjects = [
   
];

let newRoleQuestions = [
    {
        type: "input",
        name: "title",
        message: "What is the name of the role?"
    },
    {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?"
    },
    {
        type: "list",
        name: "department_id",
        message: "What department does the role belong to?",
        choices: allDepartmentsObjects
    }
]

let newRole = {
    title: "",
    salary: "",
    department_id: ""
};

const newEmployeeQuestions = [];


// NEXT STEP IS TO ADD IN CONSTRUCTORS AS OPTIONS FOR NEXTACTION.

function Menu() {
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
                    db.promise().query(`SELECT * FROM department`)
                    .then((results) => {
                        console.log(results)
                    })
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
                    db.promise().query(`SELECT * FROM department`)
                        .then((results) => {
                            results[0].forEach(department => {
                                let departmentObject = {
                                    name: department.name,
                                    value: department.id
                                }
                                allDepartmentsObjects.push(departmentObject)
                            })
                            console.log(allDepartmentsObjects)
                        })
                        .then((questions) => 
                            inquirer
                                .prompt
                                (newRoleQuestions)
                        )
                        .then((responses) => {
                            console.log(responses)
                            newRole.title = responses.title;
                            newRole.salary = responses.salary;
                        })
                        // .then((role) => {
                        //    const {title, salary} = role
                        //    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [${title}, ${salary}, ${}])
                        // })
                    break;
                case "View All Departments":
                    db.promise().query(`SELECT * FROM department`)
                        .then(([rows, fields]) => {
                            console.log("\n")
                            console.table(rows)
                        })
                        .then((reload) => {
                            Menu()
                        });
                    break;
                case "Add A Department":
                    inquirer
                        .prompt
                        (newDepartmentQuestion)
                        .then((newDepartment) => {
                            console.log(newDepartment)
                            const { newDepartmentName } = newDepartment;
                            db.query(`INSERT INTO department (name) VALUES (?)`, newDepartmentName)
                        })
                        .then((reload) => {
                            Menu()
                        });
                    break;
                default:
                    console.log("Landed at default")
            }
        })
}

module.exports = { Menu };