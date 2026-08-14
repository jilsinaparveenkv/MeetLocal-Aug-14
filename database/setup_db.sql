CREATE DATABASE IF NOT EXISTS meetlocal_db;
CREATE USER IF NOT EXISTS 'meetlocal_user'@'%' IDENTIFIED BY 'meetlocal_pass';
GRANT ALL PRIVILEGES ON meetlocal_db.* TO 'meetlocal_user'@'%';
FLUSH PRIVILEGES;
