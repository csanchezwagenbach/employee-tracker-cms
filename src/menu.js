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

let allDepartmentsObjects = [];
let allRolesObjects = [];
let allEmployeesObjects = [
    {
     name: "None",
     value: null   
    }
];

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

const newEmployeeQuestions = [
    {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
    },
    {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
    },
    {
        type: "list",
        name: "role_id",
        message: "What is the employee's role?",
        choices: allRolesObjects
    },
    {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: allEmployeesObjects
    }
];



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
                    db.promise().query(`SELECT * FROM role`)
                        .then((roles) => {
                            roles[0].forEach(role => {
                                let roleObject = {
                                    name: role.title,
                                    value: role.id
                                }
                                allRolesObjects.push(roleObject)
                            })
                            console.log(allRolesObjects)
                        })
                        .then(() => {
                            db.query(`SELECT id, concat(first_name, " ", last_name) as full_name FROM employee`, (req, employees) => {
                                console.log(employees)
                                employees.forEach(employee => {
                                    let employeeObject = {
                                        name: employee.full_name,
                                        value: employee.id
                                    }
                                    allEmployeesObjects.push(employeeObject)
                                })
                                console.log(allEmployeesObjects)
                            })
                            return allEmployeesObjects;
                        })
                        .then((questionsReady) => {
                            inquirer
                                .prompt
                                (newEmployeeQuestions)
                        })
                        .then((newEmployeeDetails) => {
                            console.log(newEmployeeDetails)
                        })
                        .then((done) => { 
                            Menu()
                        })
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
                        .then((newRole) => {
                            console.log(newRole)
                            const { title, salary, department_id } = newRole
                            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, department_id])
                        })
                        .then((done) => {
                            Menu()
                        })
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
                        .then(() => {
                            Menu()
                        });
                    break;
                default:
                    console.log("Landed at default")
            }
        })
}

module.exports = { Menu };