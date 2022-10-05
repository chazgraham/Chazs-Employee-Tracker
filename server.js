const connection = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { up } = require('inquirer/lib/utils/readline');

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
            addDepartment();
        }else if(choice.options === 'Add a Role') {
            addRole();
        }else if(choice.options === 'Add an Employee') {
            addEmployee();
        }else if(choice.options === 'Update an Employee Role') {
            employeeToBeUpdated()
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
    const sql = `SELECT job_title.id, job_title.title AS role, department.name AS department, job_title.salary
                FROM job_title
                INNER JOIN department ON job_title.department_id = department.id`;
    
    connection.promise().query(sql).then(([rows]) => {
        console.table(rows);
        promptOptions();
    });
}

const showAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name AS first, employee.last_name AS last, job_title.title AS role, department.name AS department, job_title.salary, 
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
    inquirer.prompt([
        {
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
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        
        connection.query(sql, answer.newDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.newDepartment + " to the database");
    
            promptOptions();
        });
    });
} 

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newRole',
            message: "What role would you like to add?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter new role!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: "What department ID number does you role fall into?",
            validate: nameInput => {
                if (!isNaN(nameInput)) {
                    return true;
                } else {
                    console.log('Please enter department ID number!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'newRoleSalary',
            message: "What salary would you like to add to your new role?",
            validate: nameInput => {
                if (!isNaN(nameInput)) {
                    return true;
                } else {
                    console.log('Please enter a salary!');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO job_title (title, department_id, salary) VALUES (?, ?, ?)`;
        const params = [answer.newRole, answer.roleDepartment, answer.newRoleSalary];

        connection.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.newRole + " to the database!");
            promptOptions();
        });
    });
}

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newEmployeeFirst',
            message: "What is the first name of the employee that would like to add?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter employees first name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'newEmployeeLast',
            message: "What is the last name of the employee that would like to add?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter employees last name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'newEmployeeRole',
            message: "What is the ID number of the role you would give this employee?",
            validate: nameInput => {
                if (!isNaN(nameInput)) {
                    return true;
                } else {
                    console.log('Please enter a role ID!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'newEmployeeManager',
            message: "What is the ID number of the manager assigned to this employee?",
            validate: nameInput => {
                if (!isNaN(nameInput)) {
                    return true;
                } else {
                    console.log('Please enter a managers ID!');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO employee (first_name, last_name, job_title_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [answer.newEmployeeFirst, answer.newEmployeeLast, answer.newEmployeeRole, answer.newEmployeeManager];

        connection.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.newEmployeeFirst + answer.newEmployeeLast + " to the database!");
            promptOptions();
        });
    });
}

const employeeToBeUpdated = () => {
    const sql = `SELECT employee.id, employee.first_name AS first, employee.last_name AS last, job_title.title AS role, department.name AS department, job_title.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN job_title ON employee.job_title_id = job_title.id
                LEFT JOIN department ON job_title.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    connection.promise().query(sql).then(([rows]) => {
        console.table(rows);
        updateEmployeeRole();
    });
}

const updateEmployeeRole = () => {    
    inquirer.prompt([
        {
            type: 'input',
            name: 'updateEmployee',
            message: "What is the ID number of the employee you woukd like to update?",
            validate: nameInput => {
                if (!isNaN(nameInput)) {
                    return true;
                } else {
                    console.log('Please enter a employee ID!');
                    return false;
                }
            }
        }//,
        //{
            //type: 'input',
           // name: 'newEmployeeRole',
            //message: "What is the ID number of the updated role you would give this employee?",
            //validate: nameInput => {
                //if (!isNaN(nameInput)) {
                    //return true;
                //} else {
                    //console.log('Please enter a role ID!');
                    //return false;
                //}
            //}
        //}
    ])
    .then(answer => {
        const sql = `SELECT * FROM employee WHERE id = ?`;
        const params = [ answer.updateEmployee ];

        connection.promise().query(sql, params).then(([rows]) => {
            console.table(rows);
        })
        //connection.query(sql, params, (err, result) => {
            //if (err) throw err;
            //console.log('Employee role has been updated to' + answer.updateEmployeeRole + " in the database!");
            //promptOptions();
        //});
    });
}