CREATE TABLE bank (
    firebase_id varchar(90),
    name varchar(30) NOT NULL UNIQUE,
    id SERIAL PRIMARY KEY,
    acronym varchar(6)
)
;

CREATE TABLE category (
    firebase_id varchar(90),
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(1) DEFAULT '-'::VARCHAR NOT NULL
)
;

CREATE TABLE tag (
    firebase_id varchar(90),
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
)
;

CREATE TABLE workspace (
    firebase_id varchar(90),
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
)
;

CREATE TABLE user (
    firebase_id varchar(90),
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    username VARCHAR(128) NOT NULL
)
;

CREATE TABLE transaction_type (
    firebase_id varchar(90),
    id SERIAL PRIMARY KEY,
    name varchar(20) NOT NULL,
    operation varchar(1) NOT NULL
)
;

CREATE TABLE account_type (
    firebase_id varchar(90),
    id SERIAL PRIMARY KEY,
    name varchar(30) NOT NULL UNIQUE,
    credit_card BOOLEAN DEFAULT false,
    cash BOOLEAN DEFAULT false,
    loan BOOLEAN DEFAULT false,
    read_only BOOLEAN DEFAULT true
)
;

CREATE TABLE account (
    firebase_id varchar(90),
    id SERIAL PRIMARY KEY,
    bank_id integer,
    acctyp_id integer NOT NULL,
    initial_balance money DEFAULT 0 NOT NULL,
    current_balance money DEFAULT 0 NOT NULL,
    show_in_reports boolean DEFAULT 1 NOT NULL,
    list_order smallint DEFAULT 99 NOT NULL,
    credit_limit money,
    loan_amount money,
    block_on_overdraft boolean default false,
    name varchar(20) NOT NULL unique,
    overdraft_limit money DEFAULT 0.0
);

CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    txntyp_id integer REFERENCES transaction_type(id) ON DELETE SET NULL,
    categ_id integer REFERENCES category(id) ON DELETE SET NULL,
    wrkspc_id integer REFERENCES workspace(id) ON DELETE SET NULL,
    schtxn_id integer,
    amount money DEFAULT 0.01 NOT NULL,
    date_time timestamp with time zone DEFAULT CURRENT_DATE NOT NULL,
    is_draft boolean DEFAULT 0 NOT NULL,
    is_important boolean DEFAULT 0 NOT NULL,
    fromacct_id integer NOT NULL,
    toacct_id integer,
    summary varchar(100)
    notes text
);