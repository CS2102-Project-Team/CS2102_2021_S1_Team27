DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS accounts;


CREATE TABLE accounts(
    username VARCHAR PRIMARY KEY,
    passwd VARCHAR,
    email VARCHAR
);
CREATE TABLE cards(
    cardnumber VARCHAR PRIMARY KEY,
    CVV VARCHAR(4),
    expdate VARCHAR,
    username VARCHAR REFERENCES accounts(username)
);