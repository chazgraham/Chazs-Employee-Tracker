DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS job_title;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE job_title (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    department_id INT NOT NULL,
    salary DECIMAL NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    job_title_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_job_title FOREIGN KEY (job_title_id) REFERENCES job_title(id) ON DELETE CASCADE,
    CONSTRAINT fk_employee FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);