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
DROP TABLE IF EXISTS petowners;
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
    username VARCHAR PRIMARY KEY REFERENCES accounts(username),
    privilege VARCHAR -- privilege for admins
);

CREATE TABLE cards(
    cardnumber INT, 
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
    maxpets INT --maximum concurrent pets being taken
);

CREATE TABLE looksafter(
    ctaker VARCHAR REFERENCES caretakers(username),
    price INT NOT NULL,
    ptype VARCHAR REFERENCES pettypes(ptype),
    PRIMARY KEY (ctaker, ptype)
);

CREATE TABLE calendar(
    date DATE PRIMARY KEY
);

INSERT INTO calendar(date)
    SELECT dd::date
    FROM generate_series('2020-01-01'::timestamp, '2021-12-31'::timestamp, '1 day'::interval) dd;

CREATE TABLE available(
    ctaker VARCHAR REFERENCES caretakers(username),
    date DATE REFERENCES calendar(date),
    status VARCHAR,
    PRIMARY KEY(ctaker, date)
);

CREATE TABLE services(
    ctaker VARCHAR,
    ptype VARCHAR,
    sdate DATE REFERENCES calendar(date),
    edate DATE REFERENCES calendar(date),
    CHECK(sdate <= edate),
    price INT,
    PRIMARY KEY (ctaker, ptype, sdate, edate),
    FOREIGN KEY (ctaker, ptype) REFERENCES looksafter(ctaker, ptype)
);

INSERT INTO services(ctaker, ptype, sdate, edate, price) VALUES ('kyle2', 'cat', '2020-08-20', '2020-08-22', 60);

CREATE TABLE orders(
    bidtime TIMESTAMP,
    powner VARCHAR NOT NULL,
    pname VARCHAR NOT NULL,
    ctaker VARCHAR,
    ptype VARCHAR NOT NULL,
    remark VARCHAR, --special requirement
    sdate DATE REFERENCES calendar(date),
    edate DATE REFERENCES calendar(date),
    rating INT,
    delivery VARCHAR NOT NULL, --delivery mode
    payment VARCHAR NOT NULL, --payment method
    review VARCHAR,
    status VARCHAR,
    PRIMARY KEY (powner, pname, sdate, edate),
    FOREIGN KEY (powner, pname) REFERENCES pets(powner, pname),
    FOREIGN KEY (ctaker, ptype, sdate, edate) REFERENCES services(ctaker, ptype, sdate, edate)
);

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
--can add changes to maxpetsallowed as well

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

