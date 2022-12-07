const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const requests = require('./DBRequests/db');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const promptTest = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ])
    .then((choice) => {
      if (choice.option === 'Exit') {
        process.exit();
      }
      if (choice.option === 'View all departments') {
        getAllDepartments();
      } else if (choice.option === 'View all roles') {
        getAllRoles();
      }
    });
};

function getAllDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results);
    promptTest();
  });
}

function getAllRoles() {
  db.query(
    `SELECT role.title as 'Role Title', role.id as 'Role ID', department.name as 'Department Name', role.salary as 'Salary' FROM role JOIN department ON role.department_id = department.id;`,
    function (err, results) {
      console.table(results);
      promptTest();
    }
  );
}

promptTest();

