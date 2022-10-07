CREATE DATABASE stratosphere;
ALTER DATABASE stratosphere OWNER TO postgres;

\connect stratosphere

CREATE TABLE replay (
	id		    bigserial	not null	primary key,
	filename		varchar(120)	not null,
	dataValue		int		not null);