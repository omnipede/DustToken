CREATE TABLE back (
	id INT NOT NULL AUTO_INCREMENT,
	device_id INT(10),
	hash VARCHAR(66),
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);
