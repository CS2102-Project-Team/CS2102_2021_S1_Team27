DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS petowners;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS tokens;


CREATE TABLE accounts(
    username VARCHAR PRIMARY KEY,
    passwd VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE
    phone VARCHAR,
    addres VARCHAR,
    realname VARCHAR
);

CREATE TABLE admins(
    username PRIMARY KEY REFERENCES accounts(username)
);

CREATE TABLE cards(
    cardnumber VARCHAR,
    holdername VARCHAR NOT NULL,
    CVV VARCHAR(4) NOT NULL,
    expdate VARCHAR NOT NULL,
    username VARCHAR REFERENCES accounts(username)
    PRIMARY KEY (cardnumber, username)
);

CREATE TABLE petowners(
    username VARCHAR REFERENCES accounts(username) ON DELETE CASCADE
);

CREATE TABLE pettypes(
    ptype VARCHAR PRIMARY KEY
);

CREATE TABLE pets(
    powner VARCHAR REFERENCES petowners(username) ON DELETE CASCADE,
    pname VARCHAR,
    remark VARCHAR,
    ptype VARCHAR REFERENCES pettypes(ptype) ON DELETE CASCADE,
    PRIMARY KEY(powner, pname)
);

CREATE TABLE caretakers(
    username VARCHAR REFERENCES accounts(username), 
    fulltime BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2),
    maxpets INT
);

CREATE TABLE looksafter(
    ctaker VARCHAR REFERENCES caretakers(username),
    price INT NOT NULL,
    ptype VARCHAR REFERENCES pettypes(ptype),
    PRIMARY KEY (ctaker, ptype)
);



CREATE TABLE tokens(
    token VARCHAR PRIMARY KEY
);