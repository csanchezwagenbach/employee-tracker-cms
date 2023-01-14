const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");
const NextAction = require("./src/menu");



NextAction.Menu();


// I initially visualized utilizing index.js as a central place to import all required files, but as it turned out, the vast, vast majority of the code wound up written all in one file, src/menu.js

// Index serves as the actual location where the function is called and runs the Menu upon loading.




