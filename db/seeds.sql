INSERT INTO department (name)
VALUES ("Shipping"),
       ("Customer Service"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Exporter", 50000, 1),
       ("Importer", 52000, 1),
       ("Telemarketing Specialist", 29000, 3),
       ("Care Specialist", 35000, 2),
       ("Orders Assistant", 33000, 2),
       ("Driver", 42000, 1),
       ("Sales Rep", 66000, 3),
       ("Account Manager", 77000, 3),
       ("Customer Returns", 48000, 2),
       ("Customer Service Manager", 65000, 2),
       ("Shipping Manager", 72000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jan", "Enero", 10, NULL),
       ("Feb", "Fever", 8, NULL),
       ("Mark", "Spring", 11, NULL),
       ("April", "Rain", 1, 3),
       ("May", "Mayo", 2, 3),
       ("June", "Junio", 3, 2),
       ("July", "Julio", 4, 1),
       ("Auggie", "August", 5, 1),
       ("Septo", "September", 6, 3),
       ("Octo", "Tober", 7, 2),
       ("Novo", "Vember", 9, 1);


