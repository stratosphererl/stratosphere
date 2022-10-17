CREATE DATABASE IF NOT EXISTS stratosphere;
ALTER DATABASE stratosphere OWNER TO postgres;

\connect stratosphere

ALTER USER postgres PASSWORD 'mynewpassword';

CREATE TABLE IF NOT EXISTS replay (
	id		    bigserial	not null	primary key,
	filename		varchar(120)	not null,
	dataValue		int		not null);