-- Create the neurofleetx database
CREATE DATABASE IF NOT EXISTS neurofleetx;

-- Create the neurofleetx user with the password from your application.properties
CREATE USER IF NOT EXISTS 'neurofleetx'@'localhost' IDENTIFIED BY 'jhanu28';

-- Grant all privileges on the neurofleetx database to the neurofleetx user
GRANT ALL PRIVILEGES ON neurofleetx.* TO 'neurofleetx'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Use the database
USE neurofleetx;

-- Show databases to confirm creation
SHOW DATABASES;