DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS tokens;
DROP TRIGGER IF EXISTS update_rating ON orders;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS available;
DROP TABLE IF EXISTS calendar;
DROP TABLE IF EXISTS looksafter;
DROP TABLE IF EXISTS caretakers;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS pettypes;
DROP TABLE IF EXISTS accounts;



CREATE TABLE accounts(
    username VARCHAR PRIMARY KEY,
    passwd VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    phone VARCHAR,
    addres VARCHAR,
    realname VARCHAR
);

CREATE TABLE admins(
    username VARCHAR PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    passwd VARCHAR NOT NULL,
    privilege VARCHAR -- privilege for admins
);

CREATE TABLE cards(
    cardnumber VARCHAR(16), 
    holdername VARCHAR NOT NULL,
    CVV VARCHAR(4) NOT NULL, 
    expdate VARCHAR NOT NULL,
    username VARCHAR REFERENCES accounts(username),
    PRIMARY KEY (cardnumber, username) 
);

CREATE TABLE pettypes(
    ptype VARCHAR PRIMARY KEY
);

INSERT INTO pettypes(ptype) VALUES ('cat');
INSERT INTO pettypes(ptype) VALUES ('dog');
INSERT INTO pettypes(ptype) VALUES ('bird');


CREATE TABLE pets(
    powner VARCHAR NOT NULL REFERENCES accounts(username) ON DELETE CASCADE,
    pname VARCHAR,
    remark VARCHAR,
    ptype VARCHAR REFERENCES pettypes(ptype) ON DELETE CASCADE,
    PRIMARY KEY(powner, pname)
);

CREATE TABLE caretakers(
    username VARCHAR PRIMARY KEY REFERENCES accounts(username), 
    fulltime BOOLEAN DEFAULT FALSE,
    sumrating INT DEFAULT 0,
    numrating INT DEFAULT 0,
    maxpets INT, --maximum concurrent pets being taken
    apptime TIMESTAMP
);

CREATE TABLE looksafter(
    ctaker VARCHAR REFERENCES caretakers(username),
    price INT NOT NULL,
    ptype VARCHAR REFERENCES pettypes(ptype),
    PRIMARY KEY (ctaker, ptype)
);

--INSERT INTO looksafter VALUES ('kyle2', 20, 'cat');

CREATE TABLE calendar(
    date DATE PRIMARY KEY
);

INSERT INTO calendar(date)
    SELECT dd::date
    FROM generate_series('2020-01-01'::timestamp, '2021-12-31'::timestamp, '1 day'::interval) dd;

CREATE TABLE available(
    ctaker VARCHAR REFERENCES caretakers(username),
    date DATE REFERENCES calendar(date),
    status VARCHAR DEFAULT 'available', --available, full
    PRIMARY KEY(ctaker, date)
);

CREATE TABLE orders(
    bidtime TIMESTAMP,
    powner VARCHAR NOT NULL,
    pname VARCHAR NOT NULL,
    ctaker VARCHAR,
    ptype VARCHAR NOT NULL,
    remark VARCHAR, --special requirement
    sdate DATE REFERENCES calendar(date),
    edate DATE REFERENCES calendar(date),
    CHECK(sdate <= edate),
    rating INT,
    price INT,
    delivery VARCHAR NOT NULL, --delivery mode
    payment VARCHAR NOT NULL, --payment method
    review VARCHAR,
    status VARCHAR,
    PRIMARY KEY (powner, pname, sdate, edate),
    FOREIGN KEY (powner, pname) REFERENCES pets(powner, pname),
    FOREIGN KEY (ctaker, ptype) REFERENCES looksafter(ctaker, ptype)
);

--helper functions
create or replace function end_of_month(date)
returns date as
$$
select (date_trunc('month', $1) + interval '1 month' - interval '1 day')::date;
$$ language 'sql'
immutable strict;

create or replace function start_of_month(date)
returns date as
$$
select (date_trunc('month', $1))::date;
$$ language 'sql'
immutable strict;

CREATE OR REPLACE FUNCTION later_date(date, date)
RETURNS DATE AS
$$ SELECT (CASE WHEN $1 >= $2 THEN $1 ELSE $2 END);
$$ language 'sql';

CREATE OR REPLACE FUNCTION earlier_date(date, date)
RETURNS DATE AS
$$ SELECT (CASE WHEN $1 <= $2 THEN $1 ELSE $2 END);
$$ language 'sql';


--triggers

CREATE OR REPLACE FUNCTION update_rating()
RETURNS TRIGGER AS
$$ BEGIN
IF OLD.rating IS NULL THEN
    UPDATE caretakers SET numrating = numrating + 1 WHERE username = NEW.ctaker;
    UPDATE caretakers SET sumrating = sumrating + NEW.rating WHERE username = NEW.ctaker;
ELSE
    UPDATE caretakers SET sumrating = sumrating + NEW.rating - OLD.rating WHERE username = NEW.ctaker;
END IF;
RETURN NEW;
END; $$
LANGUAGE plpgsql;
--can add changes to maxpetsallowed and service price(for full time) as well

CREATE TRIGGER update_rating
AFTER UPDATE OF rating ON orders 
FOR EACH ROW EXECUTE FUNCTION update_rating(); 

CREATE OR REPLACE FUNCTION accept_bid()
RETURNS TRIGGER AS
$$ DECLARE ft BOOLEAN;
BEGIN
SELECT fulltime INTO ft FROM caretakers WHERE username = NEW.ctaker;
IF ft = true THEN
    NEW.status = 'Pending Payment';
END IF;
RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER accept_bid_fulltime
BEFORE INSERT ON orders 
FOR EACH ROW EXECUTE FUNCTION accept_bid(); 


CREATE OR REPLACE FUNCTION update_available()
RETURNS TRIGGER AS
$$ DECLARE maxpet INTEGER;
BEGIN
SELECT maxpets INTO maxpet FROM caretakers WHERE username = NEW.ctaker;

UPDATE available A
SET status='full'
WHERE A.ctaker = NEW.ctaker AND maxpet<=(SELECT COUNT(*) FROM orders O WHERE O.ctaker = A.ctaker AND (O.status='Payment Received' OR O.status='Pending Payment')  AND A.date>=O.sdate AND A.date<=O.edate);

RETURN NEW;
END; $$
LANGUAGE plpgsql;


CREATE TRIGGER update_available_after_payment
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW WHEN (NEW.status = 'Payment Received' OR NEW.status = 'Pending Payment')
EXECUTE FUNCTION update_available(); 
