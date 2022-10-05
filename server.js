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
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit']
        }
    ])
    .then(choice => {
        if(choice.options === 'View All Departments') {
            console.log('View All Departments chosen');
        }else if(choice.options === 'View All Roles') {
            console.log('View All Roles chosen');
        }else if(choice.options === 'View All Employees') {
            console.log('View All Employees chosen');
        }else if(choice.options === 'Add a Department') {
            console.log('Add a Department chosen');
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