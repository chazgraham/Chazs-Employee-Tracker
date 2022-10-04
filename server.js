const connection = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');


connection.connect((error) => {
    if (error) throw error;
    console.log(``);
  
    promptOptions();
});

const promptOptions = () => {
    console.log(`
    =================
    EMPLOYEE TRACKER
    =================
    `);
    return inquirer.prompt([
        {
            name: 'options',
            type: 'list',
            message: 'What would you like to do? (use arrow keys)',
            choices: ['View All Employees', 'Add Employee', 'Update Employee', 'View All Job Titles', 'Add Job Title', 'View All Departments', 'Add Department']
        }
    ])
} 