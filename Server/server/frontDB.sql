CREATE TABLE front (
	device_id INT(10),
	username VARCHAR(20),
	wallet_address VARCHAR(66),
	location VARCHAR(10),
	PRIMARY KEY (device_id)
);

INSERT INTO front SET username='admin',
	device_id='032901',
	wallet_address='0x0164214FF43A46c8ad6C399811576ABFaB68FA42',
	location='K';
INSERT INTO front SET username='admin',
	device_id='032902',
	wallet_address='0x81efe0E5894085395F9E4B3B8745DC28304fcf3c',
	location='AS';
