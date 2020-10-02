DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS accounts;


CREATE TABLE accounts(
    username VARCHAR PRIMARY KEY,
    passwd VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE
);

CREATE TABLE cards(
    cardnumber VARCHAR PRIMARY KEY,
    CVV VARCHAR(4),
    expdate VARCHAR,
    username VARCHAR REFERENCES accounts(username)
);