const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");

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
let allManagersObjects = [];

const nextActionQuestion = {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
        "View All Employees",
        "View All Employees By Manager",
        "Add An Employee",
        "Delete An Employee",
        "Update Employee Role",
        "View All Roles",
        "Add A Role",
        "Delete A Role",
        "View All Departments",
        "View All Departments Total Utilized Budget",
        "Add A Department",
        "Delete A Department",
        "Quit The Program"
    ]
}

const newDepartmentQuestion = {
    type: "input",
    name: "newDepartmentName",
    message: "What is the name of the department?"
};

const deleteDepartmentQuestion = {
    type: "list",
    name: "id",
    message: "Which department would you like to delete?",
    choices: allDepartmentsObjects
}

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

const deleteRoleQuestion = {
    type: "list",
    name: "id",
    message: "Which role would you like to delete?",
    choices: allRolesObjects
}

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

const deleteEmployeeQuestion = {
    type: "list",
    name: "id",
    message: "Which employee would you like to delete?",
    choices: allEmployeesObjects
}

const updateEmployeeRoleQuestions = [
    {
        type: "list",
        name: "id",
        message: "Which employee's role do you want to update?",
        choices: allEmployeesObjects
    },
    {
        type: "list",
        name: "role_id",
        message: "Which role do you want to assign the selected employee?",
        choices: allRolesObjects
    }
]

const viewEmployeesByManagerQuestion = {
    type: "list",
    name: "manager_id",
    message: "Which manager's employees do you want to view?",
    choices: allManagersObjects
}


function Menu() {
    inquirer
        .prompt
        (nextActionQuestion)
        .then((nextAction) => {
            switch (nextAction.choice) {
                case "View All Employees":
                    db.promise().query(`SELECT
                            e.id, e.first_name, e.last_name, title, name AS department, salary, concat(m.first_name, " ", m.last_name) AS manager
                            FROM employee e
                            INNER JOIN role ON e.role_id = role.id
                            JOIN department ON role.department_id = department.id
                            LEFT JOIN employee m ON m.id = e.manager_id 
                            ORDER BY e.id ASC`)
                        .then((res) => {
                            console.log("\n")
                            console.table(res[0])
                            console.log("\n")
                        });
                    setTimeout(() => {
                        Menu();
                    }, 1000)
                    break;
                case "View All Employees By Manager":
                    db.promise().query(`SELECT
                    e.id, e.first_name, e.last_name, title, name AS department, salary, concat(m.first_name, " ", m.last_name) AS manager
                    FROM employee e
                    INNER JOIN role ON e.role_id = role.id
                    JOIN department ON role.department_id = department.id
                    LEFT JOIN employee m ON m.id = e.manager_id 
                    ORDER BY e.id ASC`)
                    .then((res) => {
                        // USE A SET CONSTRUCTOR TO CREATE A UNIQUE ARRAY OF MANAGER OBJECTS
                    })
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
                        })
                        .then(() => {
                            db.query(`SELECT id, concat(first_name, " ", last_name) as full_name FROM employee`, (req, employees) => {
                                employees.forEach(employee => {
                                    let employeeObject = {
                                        name: employee.full_name,
                                        value: employee.id
                                    }
                                    allEmployeesObjects.push(employeeObject)
                                })
                            })
                            return allEmployeesObjects;
                        })
                        .then((questionsReady) => {
                            inquirer
                                .prompt
                                (newEmployeeQuestions)
                                .then((newEmployeeDetails) => {
                                    const { first_name, last_name, role_id, manager_id } = newEmployeeDetails
                                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [first_name, last_name, role_id, manager_id])
                                    console.log("Added " + first_name + " " + last_name + " to the database")
                                })
                                .then(() => {
                                    allRolesObjects = [];
                                    allEmployeesObjects = [];
                                    Menu();
                                })
                        })
                    break;
                case "Delete An Employee":
                    db.promise().query(`SELECT id, concat(first_name, " ", last_name) AS name FROM employee`)
                        .then((employees) => {
                            employees[0].forEach(employee => {
                                console.log(employee)
                                let employeeObject = {
                                    name: employee.name,
                                    value: employee.id
                                }
                                allEmployeesObjects.push(employeeObject)
                            })
                        })
                        .then((questionReady) => {
                            inquirer
                                .prompt(deleteEmployeeQuestion)
                                .then((deletedEmployee) => {
                                    const { id, name } = deletedEmployee
                                    db.query(`DELETE FROM employee WHERE id = ?`, id)
                                    console.log("Successfully deleted employee")
                                    allEmployeesObjects = [];
                                    Menu()
                                })
                        })
                    break;
                case "Update Employee Role":
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
                            db.promise().query(`SELECT id, concat(first_name, " ", last_name) as full_name FROM employee`)
                                .then((employees) => {
                                    employees[0].forEach(employee => {
                                        console.log(employee)
                                        let employeeObject = {
                                            name: employee.full_name,
                                            value: employee.id
                                        }
                                        allEmployeesObjects.push(employeeObject)
                                    })
                                    console.log(allEmployeesObjects)
                                })
                                .then((questionsReady) => {
                                    inquirer
                                        .prompt
                                        (updateEmployeeRoleQuestions)
                                        .then((updatedEmployeeDetails) => {
                                            console.log(updatedEmployeeDetails)
                                            const { role_id, id } = updatedEmployeeDetails
                                            db.query(`UPDATE employee
                                        SET role_id = ?
                                        WHERE id = ?`, [role_id, id])
                                            console.log("Updated employee's role")
                                        })
                                        .then(() => {
                                            allRolesObjects = [];
                                            allEmployeesObjects = [];
                                            Menu();
                                        })
                                })
                        })

                    break;
                case "View All Roles":
                    db.promise().query(`SELECT 
                            role.id, title, name AS department, salary 
                            FROM role
                            JOIN department ON role.department_id = department.id
                            ORDER BY role.id ASC`)
                        .then((res) => {
                            console.log("\n")
                            console.table(res[0])
                            console.log("\n")
                        });
                    setTimeout(() => {
                        Menu();
                    }, 1000)
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
                        })
                        .then((questions) =>
                            inquirer
                                .prompt
                                (newRoleQuestions)
                        )
                        .then((newRole) => {
                            const { title, salary, department_id } = newRole
                            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, department_id])
                            console.log("Added " + title + " to the database")
                        })
                        .then((done) => {
                            allDepartmentsObjects = [];
                            Menu()
                        })
                    break;
                case "Delete A Role":
                    db.promise().query(`SELECT id, title FROM role`)
                        .then((roles) => {
                            roles[0].forEach(role => {
                                let roleObject = {
                                    name: role.title,
                                    value: role.id
                                }
                                allRolesObjects.push(roleObject)
                            })
                        })
                        .then((questions) =>
                            inquirer
                                .prompt
                                (deleteRoleQuestion)
                        ).then((roleToDelete) => {
                            const { id } = roleToDelete
                            db.query(`DELETE FROM role WHERE id = ?`, id)
                            console.log("Successfully deleted role from database")
                        })
                        .then((done) => {
                            allRolesObjects = [];
                            Menu()
                        })
                    break;
                case "View All Departments":
                    db.promise().query(`SELECT * FROM department`)
                        .then(([rows, fields]) => {
                            console.log("\n")
                            console.table(rows)
                            console.log("\n")
                        });
                    setTimeout(() => {
                        Menu();
                    }, 1000)
                    break;
                case "View All Departments Total Utilized Budget":
                    db.promise().query(`SELECT department.name as Department, SUM(salary) as "Total Utilized Budget" FROM role JOIN department ON role.department_id = department.id GROUP BY department_id 
                    `)
                    .then((res) => {
                            console.log("\n")
                            console.table(res[0])
                            console.log("\n")
                        });
                    setTimeout(() => {
                        Menu();
                    }, 1000)
                    break;
                case "Add A Department":
                    inquirer
                        .prompt
                        (newDepartmentQuestion)
                        .then((newDepartment) => {
                            const { newDepartmentName } = newDepartment;
                            db.query(`INSERT INTO department (name) VALUES (?)`, newDepartmentName)
                            console.log("Added " + newDepartmentName + " to the database")
                        })
                        .then(() => {
                            Menu()
                        });
                    break;
                case "Delete A Department":
                    db.promise().query(`SELECT * FROM department`)
                        .then((departments) => {
                            departments[0].forEach(department => {
                                let departmentObject = {
                                    name: department.name,
                                    value: department.id
                                }
                                allDepartmentsObjects.push(departmentObject)
                            })
                        })
                        .then((questions) =>
                            inquirer
                                .prompt
                                (deleteDepartmentQuestion)
                        ).then((departmentToDelete) => {
                            const { id } = departmentToDelete
                            db.query(`DELETE FROM department WHERE id = ?`, id)
                            console.log("Successfully deleted department from database")
                        })
                        .then((done) => {
                            allDepartmentsObjects = [];
                            Menu()
                        })
                    break;
                default:
                    console.log("\n")
                    console.log("Thank you for using our content management system. Goodbye!")
                    process.exit(0);
            }
        })
}

module.exports = { Menu };