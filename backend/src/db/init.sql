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
DROP TABLE IF EXISTS fulltime_price;



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
    apptime TIMESTAMP,
    fulltimesince DATE
);

CREATE TABLE looksafter(
    ctaker VARCHAR REFERENCES caretakers(username),
    price INT NOT NULL,
    ptype VARCHAR REFERENCES pettypes(ptype),
    PRIMARY KEY (ctaker, ptype)
);

CREATE TABLE fulltime_price(
    ptype VARCHAR PRIMARY KEY REFERENCES pettypes(ptype),
    price1 INT, --  <=2
    price2 INT, --  2<x<=4
    price3 INT -- x > 4
);

INSERT INTO fulltime_price VALUES ('cat', 10, 10, 10);
INSERT INTO fulltime_price VALUES ('dog', 20, 20, 20);
INSERT INTO fulltime_price VALUES ('fish', 10, 15, 20);

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

CREATE TABLE leave(
    ctaker VARCHAR REFERENCES caretakers(username),
    startdate DATE REFERENCES calendar(date),
    enddate DATE REFERENCES calendar(date),
    clash VARCHAR DEFAULT 'false',
    status VARCHAR DEFAULT 'pending', --pending, approved
    PRIMARY KEY(ctaker, startdate, enddate)
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

CREATE OR REPLACE FUNCTION get_rating(VARCHAR)
RETURNS NUMERIC AS
$$ SELECT (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) FROM caretakers WHERE username = $1;
$$ language 'sql';

CREATE OR REPLACE FUNCTION check_fulltime(VARCHAR, DATE)
RETURNS BOOLEAN AS
$$ SELECT (CASE WHEN (SELECT fulltime FROM caretakers WHERE username=$1)=TRUE AND (SELECT fulltimesince FROM caretakers WHERE username=$1)<($2::DATE) THEN TRUE ELSE FALSE END);
$$ language 'sql';
--triggers


CREATE OR REPLACE PROCEDURE update_maxpets(ctaker VARCHAR) AS
$$ DECLARE ft BOOLEAN;
BEGIN
SELECT fulltime INTO ft FROM caretakers WHERE username = ctaker;
IF ft = false THEN
    IF get_rating(ctaker) >= 4 THEN
        UPDATE caretakers SET maxpets=5 WHERE username = ctaker;
    ELSE
        UPDATE caretakers SET maxpets=2 WHERE username = ctaker;
    END IF;
END IF;
END; 
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_rating()
RETURNS TRIGGER AS
$$ 
DECLARE ft BOOLEAN;
BEGIN
SELECT fulltime INTO ft FROM caretakers WHERE username = NEW.ctaker;
IF OLD.rating IS NULL THEN
    UPDATE caretakers SET numrating = numrating + 1 WHERE username = NEW.ctaker;
    UPDATE caretakers SET sumrating = sumrating + NEW.rating WHERE username = NEW.ctaker;
ELSE
    UPDATE caretakers SET sumrating = sumrating + NEW.rating - OLD.rating WHERE username = NEW.ctaker;
END IF;
CALL update_maxpets(NEW.ctaker);
IF fulltime = true THEN
    UPDATE looksafter L SET price = (SELECT price1 FROM fulltime_price F WHERE F.ptype=L.ptype) WHERE ctaker=NEW.ctaker AND get_rating(ctaker)<=2;
    UPDATE looksafter L SET price = (SELECT price2 FROM fulltime_price F WHERE F.ptype=L.ptype) WHERE ctaker=NEW.ctaker AND get_rating(ctaker)>2 AND get_rating(ctaker)<=4;
    UPDATE looksafter L SET price = (SELECT price3 FROM fulltime_price F WHERE F.ptype=L.ptype) WHERE ctaker=NEW.ctaker AND get_rating(ctaker)>4;
END IF;

RETURN NEW;
END; $$
LANGUAGE plpgsql;


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


-- CREATE OR REPLACE FUNCTION update_clash()
-- RETURNS TRIGGER AS
-- $$ 
-- BEGIN
-- if EXISTS (SELECT 1 FROM orders O WHERE O.sdate <= NEW.enddate AND O.edate >= NEW.startdate AND O.ctaker = NEW.ctaker)
-- THEN 
-- UPDATE leave L SET clash = 'true' WHERE L.ctaker = NEW.ctaker AND L.startdate = NEW.startdate AND L.enddate = NEW.enddate;
-- END IF;
-- RETURN NEW;
-- END;
-- $$
-- LANGUAGE plpgsql;

-- CREATE TRIGGER update_clash_after_leave
-- AFTER INSERT ON leave
-- FOR EACH ROW
-- EXECUTE PROCEDURE update_clash();


CREATE OR REPLACE PROCEDURE update_leave(ctakerV VARCHAR, startdateV DATE, enddateV DATE) AS
$$
BEGIN
if check_clash(ctakerV, startdateV, enddateV) = 'false'
THEN
INSERT INTO leave(ctaker, startdate, enddate, clash) 
VALUES (ctakerV, startdateV, enddateV, check_clash(ctakerV, startdateV, enddateV));
RAISE NOTICE 'sucessfully done!';
END IF;
END;
$$
language plpgsql;
--one thing yet to finalize is how to send notification when the procedure is rolled back

CREATE OR REPLACE FUNCTION check_clash(ctakerV VARCHAR, startdateV DATE, enddateV DATE) 
RETURNS varchar AS
$$
DECLARE clash varchar = 'true';
BEGIN
if NOT EXISTS (SELECT 1 FROM orders O WHERE O.sdate <= enddateV AND O.edate >= startdateV AND O.ctaker = ctakerV 
AND (O.status = 'Payment Received' OR O.status = 'Pending Payment' OR O.status = 'Pending Caretaker Acceptance'))
THEN
clash = 'false';
END IF;
RETURN clash;
END;
$$
language plpgsql;

CREATE OR REPLACE PROCEDURE update_price(category VARCHAR) AS
$$
DECLARE price1t INTEGER;
DECLARE price2t INTEGER;
DECLARE price3t INTEGER;

BEGIN
SELECT price1 INTO price1t FROM fulltime_price WHERE ptype = category;
SELECT price2 INTO price2t FROM fulltime_price WHERE ptype = category;
SELECT price3 INTO price3t FROM fulltime_price WHERE ptype = category;
RAISE NOTICE 'i want to print % and %', price1t,price2t;
UPDATE looksafter SET price = price1t WHERE ptype = category AND (SELECT (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = ctaker) <=2 AND (SELECT fulltime FROM caretakers WHERE username = ctaker) = TRUE;
UPDATE looksafter SET price = price2t WHERE ptype = category AND (SELECT (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = ctaker) > 2 AND (SELECT (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = ctaker) <= 4 AND (SELECT fulltime FROM caretakers WHERE username = ctaker) = TRUE;
UPDATE looksafter SET price = price3t WHERE ptype = category AND (SELECT (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = ctaker) > 4 AND (SELECT fulltime FROM caretakers WHERE username = ctaker) = TRUE;
END;
$$

language plpgsql;

CREATE OR REPLACE FUNCTION update_price_f(category VARCHAR)
RETURNS INT AS
$$
DECLARE price1t INTEGER;
DECLARE price2t INTEGER;
DECLARE price3t INTEGER;

BEGIN
SELECT price1 INTO price1t FROM fulltime_price WHERE ptype = category;
SELECT price2 INTO price2t FROM fulltime_price WHERE ptype = category;
SELECT price3 INTO price3t FROM fulltime_price WHERE ptype = category;
RAISE NOTICE 'i want to print % and %', price1t,price2t;
UPDATE looksafter SET price = price1t WHERE ptype = category AND (SELECT (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = ctaker) <=2 AND (SELECT fulltime FROM caretakers WHERE username = ctaker) = TRUE;
UPDATE looksafter SET price = price2t WHERE ptype = category AND (SELECT (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = ctaker) > 2 AND (SELECT (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = ctaker) <= 4 AND (SELECT fulltime FROM caretakers WHERE username = ctaker) = TRUE;
UPDATE looksafter SET price = price3t WHERE ptype = category AND (SELECT (CASE WHEN numrating=0 THEN -1 ELSE (sumrating+0.0)/numrating END) AS rating FROM caretakers WHERE username = ctaker) > 4 AND (SELECT fulltime FROM caretakers WHERE username = ctaker) = TRUE;
return 1;
END;
$$

language plpgsql;



CREATE OR REPLACE FUNCTION update_available_leave()
RETURNS TRIGGER AS
$$ 
DECLARE maxpet INTEGER;
BEGIN
DELETE FROM available WHERE ctaker = NEW.ctaker AND (date <= NEW.enddate AND date >= NEW.startdate);
RETURN NEW;
END; $$
LANGUAGE plpgsql;


CREATE TRIGGER update_available_after_leave
AFTER INSERT OR UPDATE ON leave
FOR EACH ROW WHEN (NEW.status = 'approved')
EXECUTE FUNCTION update_available_leave(); 


CREATE OR REPLACE FUNCTION check_invalid_application(ctakerV VARCHAR, startdateV DATE, enddateV DATE) 
RETURNS varchar AS
$$
DECLARE clash varchar = 'false';
BEGIN
if EXISTS (SELECT 1 FROM leave O WHERE O.startdate <= enddateV AND O.enddate >= startdateV AND O.ctaker = ctakerV AND (O.status = 'pending' OR O.status = 'approved'))
THEN
clash = 'true';
END IF;
RETURN clash;
END;
$$
language plpgsql;
