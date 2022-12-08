const inquirer = require('inquirer');
const quest = require('./questions/questionPrompts');
const db = require('./config/connection');
const cTable = require('console.table');
const { type } = require('os');
require('dotenv').config();

const firstPrompt = () => {
  inquirer.prompt([quest.whatToDoQuestions]).then((data) => {
    if (data.option === 'Add a role') {
      getDepartment();
    } else if (data.option === 'View all departments') {
      viewDepartments();
    } else if (data.option === 'View all roles') {
      viewRoles();
    } else if (data.option === 'Add a department') {
      addDepartment();
    } else if (data.option === 'View all employees') {
      viewEmployees();
    } else if (data.option === 'Add an employee') {
      getDataForEmployee();
    }
  });
};

// const getRoleTitles = () => {
//   db.query('SELECT * FROM role', async function (err, res) {
//     try {
//       addEmployee(res);
//     } catch (err) {
//       console.log(err);
//     }
//   });
// };

const getDataForEmployee = () => {
  db.query('SELECT * FROM role', async function (err, res) {
    try {
      const roleData = await res.map((title) => title.title);
      addEmployee(roleData);
    } catch (err) {}
  });
};

const addEmployee = (titleRole) => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the employees first name?',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the employees last name?',
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is the role of the employee?',
      choices: titleRole,
    },
  ]);
};

const viewEmployees = () => {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`,
    async function (err, result) {
      console.table(result);
      firstPrompt();
    }
  );
};

const viewDepartments = () => {
  db.query('SELECT * FROM department', async function (err, results) {
    try {
      console.table(results);
      firstPrompt();
    } catch (err) {
      console.log(err);
    }
  });
};

const addDepartment = () => {
  inquirer.prompt([quest.addDepQuestion]).then((data) => {
    db.query(
      `INSERT INTO department (name) VALUES ('${data.departmentName}')`,
      async function () {
        try {
          console.log('Added new department!');
        } catch (err) {
          console.log(err);
        }
      }
    );
  });
};

const viewRoles = () => {
  db.query(
    `SELECT role.title as 'Role Title', role.id as 'Role ID', department.name as 'Department Name', role.salary as 'Salary' FROM role JOIN department ON role.department_id = department.id;`,
    async function (err, results) {
      try {
        console.table(results);
        firstPrompt();
      } catch (err) {
        console.log(err);
      }
    }
  );
};

const getDepartment = () => {
  db.query('SELECT * FROM department', async function (err, result) {
    try {
      rolePrompts(result);
    } catch (err) {
      console.log(err);
    }
  });
};

const rolePrompts = (depName) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
      },
      {
        type: 'list',
        name: 'departmentName',
        message: 'What department does this role belong to?',
        choices: depName.map((name) => name.name),
      },
    ])
    .then((data) => {
      let departmentId;
      console.log(data);
      db.query('SELECT * FROM department', async function (err, res) {
        console.log(res);
      });
    });
};

firstPrompt();
