const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "colbywagenbach",
        database: "company_db"
    },
    console.log(`Connected to the company_db database.`)
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

