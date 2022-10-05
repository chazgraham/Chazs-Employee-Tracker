const connection = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');


connection.connect((error) => {
    if (error) throw error;
    console.log(`
    ======================
    || EMPLOYEE TRACKER ||
    ======================
    `);
  
    promptOptions();
});

const promptOptions = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit']
        }
    ])
    .then(choice => {
        if(choice.options === 'View All Departments') {
            console.log('Viewing All Departments');
            showAllDepartments();
        }else if(choice.options === 'View All Roles') {
            console.log('Viewing All Roles');
            showAllRoles();
        }else if(choice.options === 'View All Employees') {
            console.log('Viewing All Employees');
            showAllEmployees();
        }else if(choice.options === 'Add a Department') {
            console.log('Add a new Department');
            addDepartment();
        }else if(choice.options === 'Add a Role') {
            console.log('Add a Role chosen');
        }else if(choice.options === 'Add an Employee') {
            console.log('Add an Employee chosen');
        }else if(choice.options === 'Update an Employee Role') {
            console.log('Update an Employee Role chosen');
        }else if(choice.options === 'Quit') {
            connection.end();
        }
    });
}

const showAllDepartments = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
  
    connection.promise().query(sql).then(([rows]) => {
      console.table(rows);
      promptOptions();
    });
};

const showAllRoles = () => {
    const sql = `SELECT job_title.id, job_title.title, department.name AS department, job_title.salary
                FROM job_title
                INNER JOIN department ON job_title.department_id = department.id`;
    
    connection.promise().query(sql).then(([rows]) => {
        console.table(rows);
        promptOptions();
    });
}

const showAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, job_title.title, department.name AS department, job_title.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN job_title ON employee.job_title_id = job_title.id
                LEFT JOIN department ON job_title.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    connection.promise().query(sql).then(([rows]) => {
        console.table(rows);
        promptOptions();
    });
}

const addDepartment = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'newDepartment',
        message: "What department would you like to add?",
        validate: nameInput => {
            if (nameInput) {
                return true;
            } else {
                console.log('Please enter new department!');
                return false;
            }
        }
    }])
    .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        connection.query(sql, answer.newDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.newDepartment + " to departments!");
    
            showAllDepartments();
        });
    });
}