--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

-- Started on 2018-11-08 09:15:30

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS smmmdb;
DROP ROLE IF EXISTS smmmusr;
CREATE ROLE smmmusr LOGIN ENCRYPTED PASSWORD 'smmmpwd';

--
-- TOC entry 2294 (class 1262 OID 16385)
-- Name: moneydb; Type: DATABASE; Schema: -; Owner: smmmusr
--

CREATE DATABASE smmmdb WITH TEMPLATE = template0 ENCODING = 'UTF8' ;


ALTER DATABASE smmmdb OWNER TO smmmusr;

--
-- TOC entry 2295 (class 0 OID 0)
-- Dependencies: 2294
-- Name: DATABASE smmmdb; Type: COMMENT; Schema: -; Owner: smmmusr
--

COMMENT ON DATABASE smmmdb IS 'Database of web version of "Where''s my money?"';

\connect smmmdb

--
-- TOC entry 1 (class 3079 OID 12278)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2298 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 196 (class 1259 OID 16386)
-- Name: bank; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.bank (
    name character varying(30) NOT NULL,
    bank_id integer NOT NULL,
    acronym character varying(6)
)
WITH (autovacuum_enabled='true');


ALTER TABLE public.bank OWNER TO smmmusr;

--
-- TOC entry 2299 (class 0 OID 0)
-- Dependencies: 196
-- Name: TABLE bank; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.bank IS 'Banks list to associate to account';


--
-- TOC entry 197 (class 1259 OID 16389)
-- Name: BANK_bank_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public."BANK_bank_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."BANK_bank_id_seq" OWNER TO smmmusr;

--
-- TOC entry 2300 (class 0 OID 0)
-- Dependencies: 197
-- Name: BANK_bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public."BANK_bank_id_seq" OWNED BY public.bank.bank_id;


--
-- TOC entry 198 (class 1259 OID 16391)
-- Name: category_icon; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.category_icon (
    catico_id integer NOT NULL,
    icon_name character varying(20) NOT NULL
)
WITH (autovacuum_enabled='true');


ALTER TABLE public.category_icon OWNER TO smmmusr;

--
-- TOC entry 2301 (class 0 OID 0)
-- Dependencies: 198
-- Name: TABLE category_icon; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.category_icon IS 'Catalog of application icons for categories';


--
-- TOC entry 199 (class 1259 OID 16394)
-- Name: CATEGORY_ICON_catico_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public."CATEGORY_ICON_catico_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CATEGORY_ICON_catico_id_seq" OWNER TO smmmusr;

--
-- TOC entry 2302 (class 0 OID 0)
-- Dependencies: 199
-- Name: CATEGORY_ICON_catico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public."CATEGORY_ICON_catico_id_seq" OWNED BY public.category_icon.catico_id;


--
-- TOC entry 200 (class 1259 OID 16396)
-- Name: category; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.category (
    cat_id integer NOT NULL,
    name character varying(20) NOT NULL,
    catico_id integer,
    type character varying(1) DEFAULT '-'::character varying NOT NULL
)
WITH (autovacuum_enabled='true');


ALTER TABLE public.category OWNER TO smmmusr;

--
-- TOC entry 2303 (class 0 OID 0)
-- Dependencies: 200
-- Name: TABLE category; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.category IS 'Transaction categories';


--
-- TOC entry 201 (class 1259 OID 16400)
-- Name: CATEGORY_cat_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public."CATEGORY_cat_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CATEGORY_cat_id_seq" OWNER TO smmmusr;

--
-- TOC entry 2304 (class 0 OID 0)
-- Dependencies: 201
-- Name: CATEGORY_cat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public."CATEGORY_cat_id_seq" OWNED BY public.category.cat_id;


--
-- TOC entry 202 (class 1259 OID 16402)
-- Name: account; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.account (
    acct_id integer NOT NULL,
    bank_id integer,
    acctyp_id integer NOT NULL,
    initial_balance money DEFAULT 0 NOT NULL,
    initial_balance_date timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    current_balance money DEFAULT 0 NOT NULL,
    show_in_reports smallint DEFAULT 1 NOT NULL,
    list_order smallint DEFAULT 99 NOT NULL,
    credit_limit numeric(10,2),
    loan_amount numeric(10,2),
    block_on_overdraft smallint,
    name character varying(20) NOT NULL,
    overdraft_limit money DEFAULT 0.0
);


ALTER TABLE public.account OWNER TO smmmusr;

--
-- TOC entry 2305 (class 0 OID 0)
-- Dependencies: 202
-- Name: TABLE account; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.account IS 'List of all user accounts';


--
-- TOC entry 203 (class 1259 OID 16410)
-- Name: account_acct_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public.account_acct_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_acct_id_seq OWNER TO smmmusr;

--
-- TOC entry 2306 (class 0 OID 0)
-- Dependencies: 203
-- Name: account_acct_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public.account_acct_id_seq OWNED BY public.account.acct_id;


--
-- TOC entry 204 (class 1259 OID 16412)
-- Name: account_type; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.account_type (
    acctyp_id integer NOT NULL,
    name character varying(30) NOT NULL,
    is_credit_card smallint DEFAULT 0 NOT NULL,
    is_cash smallint DEFAULT 0 NOT NULL,
    is_loan smallint DEFAULT 0 NOT NULL,
    is_readonly smallint DEFAULT 0 NOT NULL
)
WITH (autovacuum_enabled='true');


ALTER TABLE public.account_type OWNER TO smmmusr;

--
-- TOC entry 2307 (class 0 OID 0)
-- Dependencies: 204
-- Name: TABLE account_type; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.account_type IS 'Catalog of account types';


--
-- TOC entry 205 (class 1259 OID 16419)
-- Name: account_type_acctyp_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public.account_type_acctyp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_type_acctyp_id_seq OWNER TO smmmusr;

--
-- TOC entry 2308 (class 0 OID 0)
-- Dependencies: 205
-- Name: account_type_acctyp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public.account_type_acctyp_id_seq OWNED BY public.account_type.acctyp_id;


--
-- TOC entry 206 (class 1259 OID 16421)
-- Name: business; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.business (
    name character varying(20),
    bsinss_id integer NOT NULL
);


ALTER TABLE public.business OWNER TO smmmusr;

--
-- TOC entry 207 (class 1259 OID 16424)
-- Name: business_bsinss_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public.business_bsinss_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.business_bsinss_id_seq OWNER TO smmmusr;

--
-- TOC entry 2309 (class 0 OID 0)
-- Dependencies: 207
-- Name: business_bsinss_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public.business_bsinss_id_seq OWNED BY public.business.bsinss_id;


--
-- TOC entry 208 (class 1259 OID 16426)
-- Name: schedule_txn; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.schedule_txn (
    schtxn_id integer NOT NULL,
    name character varying(30) NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    interval_value integer,
    interval_unit character varying(10),
    days_of_week character varying(13)
);


ALTER TABLE public.schedule_txn OWNER TO smmmusr;

--
-- TOC entry 2310 (class 0 OID 0)
-- Dependencies: 208
-- Name: TABLE schedule_txn; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.schedule_txn IS 'Manages scheduled transactions, for a single time or recurrent';


--
-- TOC entry 209 (class 1259 OID 16429)
-- Name: schedule_txn_schtxn_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public.schedule_txn_schtxn_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schedule_txn_schtxn_id_seq OWNER TO smmmusr;

--
-- TOC entry 2311 (class 0 OID 0)
-- Dependencies: 209
-- Name: schedule_txn_schtxn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public.schedule_txn_schtxn_id_seq OWNED BY public.schedule_txn.schtxn_id;


--
-- TOC entry 210 (class 1259 OID 16431)
-- Name: tag; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.tag (
    tag_id integer NOT NULL,
    name character varying(20) NOT NULL
)
WITH (autovacuum_enabled='true');


ALTER TABLE public.tag OWNER TO smmmusr;

--
-- TOC entry 2312 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE tag; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.tag IS 'Tags used to tag transactions';


--
-- TOC entry 211 (class 1259 OID 16434)
-- Name: tag_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public.tag_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_tag_id_seq OWNER TO smmmusr;

--
-- TOC entry 2313 (class 0 OID 0)
-- Dependencies: 211
-- Name: tag_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public.tag_tag_id_seq OWNED BY public.tag.tag_id;


--
-- TOC entry 212 (class 1259 OID 16436)
-- Name: transaction; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.transaction (
    txn_id integer NOT NULL,
    txntyp_id integer NOT NULL,
    cat_id integer NOT NULL,
    schtxn_id integer,
    amount money DEFAULT 0.01 NOT NULL,
    date_time timestamp with time zone DEFAULT CURRENT_DATE NOT NULL,
    is_draft smallint DEFAULT 0 NOT NULL,
    is_important smallint DEFAULT 0 NOT NULL,
    from_account integer NOT NULL,
    to_account integer,
    notes text
);


ALTER TABLE public.transaction OWNER TO smmmusr;

--
-- TOC entry 2314 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE transaction; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.transaction IS 'List of all transactions generated';


--
-- TOC entry 213 (class 1259 OID 16446)
-- Name: transaction_tag; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.transaction_tag (
    txntag_id integer NOT NULL,
    txn_id integer NOT NULL,
    tag_name character varying(20) NOT NULL
);


ALTER TABLE public.transaction_tag OWNER TO smmmusr;

--
-- TOC entry 2315 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE transaction_tag; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.transaction_tag IS 'Tags associated with a transaction';


--
-- TOC entry 214 (class 1259 OID 16449)
-- Name: transaction_tag_txntag_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public.transaction_tag_txntag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_tag_txntag_id_seq OWNER TO smmmusr;

--
-- TOC entry 2316 (class 0 OID 0)
-- Dependencies: 214
-- Name: transaction_tag_txntag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public.transaction_tag_txntag_id_seq OWNED BY public.transaction_tag.txntag_id;


--
-- TOC entry 215 (class 1259 OID 16451)
-- Name: transaction_txn_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public.transaction_txn_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_txn_id_seq OWNER TO smmmusr;

--
-- TOC entry 2317 (class 0 OID 0)
-- Dependencies: 215
-- Name: transaction_txn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public.transaction_txn_id_seq OWNED BY public.transaction.txn_id;


--
-- TOC entry 216 (class 1259 OID 16453)
-- Name: transaction_type; Type: TABLE; Schema: public; Owner: smmmusr
--

CREATE TABLE public.transaction_type (
    txntyp_id integer NOT NULL,
    name character varying(20) NOT NULL,
    operation character varying(1) NOT NULL
)
WITH (autovacuum_enabled='true');


ALTER TABLE public.transaction_type OWNER TO smmmusr;

--
-- TOC entry 2318 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE transaction_type; Type: COMMENT; Schema: public; Owner: smmmusr
--

COMMENT ON TABLE public.transaction_type IS 'Type of operations that alter an account';


--
-- TOC entry 217 (class 1259 OID 16456)
-- Name: transaction_type_txntyp_id_seq; Type: SEQUENCE; Schema: public; Owner: smmmusr
--

CREATE SEQUENCE public.transaction_type_txntyp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_type_txntyp_id_seq OWNER TO smmmusr;

--
-- TOC entry 2319 (class 0 OID 0)
-- Dependencies: 217
-- Name: transaction_type_txntyp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smmmusr
--

ALTER SEQUENCE public.transaction_type_txntyp_id_seq OWNED BY public.transaction_type.txntyp_id;


--
-- TOC entry 2092 (class 2604 OID 16458)
-- Name: account acct_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.account ALTER COLUMN acct_id SET DEFAULT nextval('public.account_acct_id_seq'::regclass);


--
-- TOC entry 2100 (class 2604 OID 16459)
-- Name: account_type acctyp_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.account_type ALTER COLUMN acctyp_id SET DEFAULT nextval('public.account_type_acctyp_id_seq'::regclass);


--
-- TOC entry 2085 (class 2604 OID 16460)
-- Name: bank bank_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.bank ALTER COLUMN bank_id SET DEFAULT nextval('public."BANK_bank_id_seq"'::regclass);


--
-- TOC entry 2101 (class 2604 OID 16461)
-- Name: business bsinss_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.business ALTER COLUMN bsinss_id SET DEFAULT nextval('public.business_bsinss_id_seq'::regclass);


--
-- TOC entry 2088 (class 2604 OID 16462)
-- Name: category cat_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.category ALTER COLUMN cat_id SET DEFAULT nextval('public."CATEGORY_cat_id_seq"'::regclass);


--
-- TOC entry 2086 (class 2604 OID 16463)
-- Name: category_icon catico_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.category_icon ALTER COLUMN catico_id SET DEFAULT nextval('public."CATEGORY_ICON_catico_id_seq"'::regclass);


--
-- TOC entry 2102 (class 2604 OID 16464)
-- Name: schedule_txn schtxn_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.schedule_txn ALTER COLUMN schtxn_id SET DEFAULT nextval('public.schedule_txn_schtxn_id_seq'::regclass);


--
-- TOC entry 2103 (class 2604 OID 16465)
-- Name: tag tag_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.tag ALTER COLUMN tag_id SET DEFAULT nextval('public.tag_tag_id_seq'::regclass);


--
-- TOC entry 2108 (class 2604 OID 16466)
-- Name: transaction txn_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction ALTER COLUMN txn_id SET DEFAULT nextval('public.transaction_txn_id_seq'::regclass);


--
-- TOC entry 2109 (class 2604 OID 16467)
-- Name: transaction_tag txntag_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction_tag ALTER COLUMN txntag_id SET DEFAULT nextval('public.transaction_tag_txntag_id_seq'::regclass);


--
-- TOC entry 2110 (class 2604 OID 16468)
-- Name: transaction_type txntyp_id; Type: DEFAULT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction_type ALTER COLUMN txntyp_id SET DEFAULT nextval('public.transaction_type_txntyp_id_seq'::regclass);


--
-- TOC entry 2273 (class 0 OID 16402)
-- Dependencies: 202
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: smmmusr
--

INSERT INTO public.account (acct_id, bank_id, acctyp_id, initial_balance, initial_balance_date, current_balance, show_in_reports, list_order, credit_limit, loan_amount, block_on_overdraft, name, overdraft_limit) VALUES (8, 2, 1, '$0.00', '2016-12-12 02:00:00-06', '$0.00', 1, 4, NULL, NULL, 0, 'Ahorro CITI', '$0.00');
INSERT INTO public.account (acct_id, bank_id, acctyp_id, initial_balance, initial_balance_date, current_balance, show_in_reports, list_order, credit_limit, loan_amount, block_on_overdraft, name, overdraft_limit) VALUES (9, 5, 1, '$0.00', '2016-12-12 02:00:00-06', '$0.00', 1, 5, NULL, NULL, 0, 'Payoneer Debit', '$0.00');
INSERT INTO public.account (acct_id, bank_id, acctyp_id, initial_balance, initial_balance_date, current_balance, show_in_reports, list_order, credit_limit, loan_amount, block_on_overdraft, name, overdraft_limit) VALUES (2, 1, 1, '$0.00', '2016-12-12 02:00:00-06', '($606.00)', 1, 1, NULL, NULL, 0, 'Ahorro BA', '$0.00');
INSERT INTO public.account (acct_id, bank_id, acctyp_id, initial_balance, initial_balance_date, current_balance, show_in_reports, list_order, credit_limit, loan_amount, block_on_overdraft, name, overdraft_limit) VALUES (5, 1, 2, '$0.00', '2016-12-12 02:00:00-06', '$296.00', 1, 2, 2000.00, NULL, 1, 'Platinum LM BA', '$0.00');
INSERT INTO public.account (acct_id, bank_id, acctyp_id, initial_balance, initial_balance_date, current_balance, show_in_reports, list_order, credit_limit, loan_amount, block_on_overdraft, name, overdraft_limit) VALUES (7, 2, 2, '$0.00', '2016-12-12 02:00:00-06', '($371.03)', 1, 3, 3000.00, NULL, 1, 'Platinum LM CITI', '$0.00');
INSERT INTO public.account (acct_id, bank_id, acctyp_id, initial_balance, initial_balance_date, current_balance, show_in_reports, list_order, credit_limit, loan_amount, block_on_overdraft, name, overdraft_limit) VALUES (11, 2, 2, '$3,450.00', '2018-11-08 06:41:25.510583-06', '$0.00', 0, 99, NULL, NULL, 0, 'Ahorro DUMMY 2', NULL);


--
-- TOC entry 2275 (class 0 OID 16412)
-- Dependencies: 204
-- Data for Name: account_type; Type: TABLE DATA; Schema: public; Owner: smmmusr
--

INSERT INTO public.account_type (acctyp_id, name, is_credit_card, is_cash, is_loan, is_readonly) VALUES (2, 'Credit card', 1, 0, 0, 0);
INSERT INTO public.account_type (acctyp_id, name, is_credit_card, is_cash, is_loan, is_readonly) VALUES (3, 'Loan', 0, 0, 1, 0);
INSERT INTO public.account_type (acctyp_id, name, is_credit_card, is_cash, is_loan, is_readonly) VALUES (4, 'Cash', 0, 1, 0, 0);
INSERT INTO public.account_type (acctyp_id, name, is_credit_card, is_cash, is_loan, is_readonly) VALUES (1, 'Savings account', 0, 0, 0, 0);


--
-- TOC entry 2267 (class 0 OID 16386)
-- Dependencies: 196
-- Data for Name: bank; Type: TABLE DATA; Schema: public; Owner: smmmusr
--

INSERT INTO public.bank (name, bank_id, acronym) VALUES ('Banco Agricola', 1, 'BA');
INSERT INTO public.bank (name, bank_id, acronym) VALUES ('CITI', 2, 'CITI');
INSERT INTO public.bank (name, bank_id, acronym) VALUES ('Banco de America Central', 3, 'BAC');
INSERT INTO public.bank (name, bank_id, acronym) VALUES ('HSBC', 4, 'HSBC');
INSERT INTO public.bank (name, bank_id, acronym) VALUES ('Payoneer', 5, 'PYN');
INSERT INTO public.bank (name, bank_id, acronym) VALUES ('Skrill', 6, 'SKR');


--
-- TOC entry 2277 (class 0 OID 16421)
-- Dependencies: 206
-- Data for Name: business; Type: TABLE DATA; Schema: public; Owner: smmmusr
--



--
-- TOC entry 2271 (class 0 OID 16396)
-- Dependencies: 200
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: smmmusr
--

INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (1, 'Adjustement', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (2, 'Bills and Taxes', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (3, 'Clothing', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (4, 'Donations', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (5, 'Education', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (6, 'Family', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (7, 'Food', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (8, 'Freelancing', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (9, 'Tools', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (10, 'Health', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (11, 'Household', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (12, 'Leisure', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (13, 'Loan', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (16, 'Transportation', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (17, 'Unexpected', NULL, '-');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (14, 'Salary', NULL, '+');
INSERT INTO public.category (cat_id, name, catico_id, type) VALUES (15, 'Sales', NULL, '+');


--
-- TOC entry 2269 (class 0 OID 16391)
-- Dependencies: 198
-- Data for Name: category_icon; Type: TABLE DATA; Schema: public; Owner: smmmusr
--



--
-- TOC entry 2279 (class 0 OID 16426)
-- Dependencies: 208
-- Data for Name: schedule_txn; Type: TABLE DATA; Schema: public; Owner: smmmusr
--



--
-- TOC entry 2281 (class 0 OID 16431)
-- Dependencies: 210
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: smmmusr
--

INSERT INTO public.tag (tag_id, name) VALUES (1, 'dad');
INSERT INTO public.tag (tag_id, name) VALUES (2, 'mom');
INSERT INTO public.tag (tag_id, name) VALUES (3, 'bills');
INSERT INTO public.tag (tag_id, name) VALUES (4, 'taxes');
INSERT INTO public.tag (tag_id, name) VALUES (5, 'adjustement');
INSERT INTO public.tag (tag_id, name) VALUES (6, 'articles');
INSERT INTO public.tag (tag_id, name) VALUES (7, 'bank');
INSERT INTO public.tag (tag_id, name) VALUES (8, 'beach');
INSERT INTO public.tag (tag_id, name) VALUES (9, 'candies');
INSERT INTO public.tag (tag_id, name) VALUES (10, 'car');
INSERT INTO public.tag (tag_id, name) VALUES (11, 'cashback');
INSERT INTO public.tag (tag_id, name) VALUES (12, 'cellphone');
INSERT INTO public.tag (tag_id, name) VALUES (13, 'church');
INSERT INTO public.tag (tag_id, name) VALUES (14, 'cine');
INSERT INTO public.tag (tag_id, name) VALUES (15, 'clothing');
INSERT INTO public.tag (tag_id, name) VALUES (16, 'coupon');
INSERT INTO public.tag (tag_id, name) VALUES (17, 'course');
INSERT INTO public.tag (tag_id, name) VALUES (18, 'creditcard');
INSERT INTO public.tag (tag_id, name) VALUES (19, 'diezmo');
INSERT INTO public.tag (tag_id, name) VALUES (20, 'drone');
INSERT INTO public.tag (tag_id, name) VALUES (21, 'electricity');
INSERT INTO public.tag (tag_id, name) VALUES (22, 'flight');
INSERT INTO public.tag (tag_id, name) VALUES (23, 'food');
INSERT INTO public.tag (tag_id, name) VALUES (24, 'freelancer');
INSERT INTO public.tag (tag_id, name) VALUES (25, 'friends');
INSERT INTO public.tag (tag_id, name) VALUES (26, 'gadget');
INSERT INTO public.tag (tag_id, name) VALUES (27, 'games');
INSERT INTO public.tag (tag_id, name) VALUES (28, 'gas');
INSERT INTO public.tag (tag_id, name) VALUES (29, 'gearbest');
INSERT INTO public.tag (tag_id, name) VALUES (30, 'getcash');
INSERT INTO public.tag (tag_id, name) VALUES (31, 'gift');
INSERT INTO public.tag (tag_id, name) VALUES (32, 'groceries');
INSERT INTO public.tag (tag_id, name) VALUES (33, 'hosting');
INSERT INTO public.tag (tag_id, name) VALUES (34, 'kindle');
INSERT INTO public.tag (tag_id, name) VALUES (35, 'license');
INSERT INTO public.tag (tag_id, name) VALUES (36, 'love');
INSERT INTO public.tag (tag_id, name) VALUES (37, 'mail');
INSERT INTO public.tag (tag_id, name) VALUES (38, 'massage');
INSERT INTO public.tag (tag_id, name) VALUES (39, 'master');
INSERT INTO public.tag (tag_id, name) VALUES (40, 'outsourcing');
INSERT INTO public.tag (tag_id, name) VALUES (41, 'papajohns');
INSERT INTO public.tag (tag_id, name) VALUES (42, 'parents');
INSERT INTO public.tag (tag_id, name) VALUES (43, 'paycard');
INSERT INTO public.tag (tag_id, name) VALUES (44, 'pet');
INSERT INTO public.tag (tag_id, name) VALUES (45, 'pizzahut');
INSERT INTO public.tag (tag_id, name) VALUES (46, 'pool');
INSERT INTO public.tag (tag_id, name) VALUES (47, 'repairs');
INSERT INTO public.tag (tag_id, name) VALUES (48, 'running');
INSERT INTO public.tag (tag_id, name) VALUES (49, 'salary');
INSERT INTO public.tag (tag_id, name) VALUES (50, 'shipping');
INSERT INTO public.tag (tag_id, name) VALUES (51, 'shoes');
INSERT INTO public.tag (tag_id, name) VALUES (52, 'soccer');
INSERT INTO public.tag (tag_id, name) VALUES (53, 'socks');
INSERT INTO public.tag (tag_id, name) VALUES (54, 'sports');
INSERT INTO public.tag (tag_id, name) VALUES (55, 'teeth');
INSERT INTO public.tag (tag_id, name) VALUES (56, 'townhall');
INSERT INTO public.tag (tag_id, name) VALUES (57, 'toys');
INSERT INTO public.tag (tag_id, name) VALUES (58, 'udemy');
INSERT INTO public.tag (tag_id, name) VALUES (59, 'usedstuff');
INSERT INTO public.tag (tag_id, name) VALUES (60, 'website');
INSERT INTO public.tag (tag_id, name) VALUES (61, 'work');
INSERT INTO public.tag (tag_id, name) VALUES (62, 'mynewtag');


--
-- TOC entry 2283 (class 0 OID 16436)
-- Dependencies: 212
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: smmmusr
--

INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (2, 1, 14, NULL, '$23.50', '2018-04-07 08:59:35.82-06', 0, 0, 2, NULL, 'Test transaction');
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (11, 2, 1, NULL, '$45.00', '2018-04-07 08:59:35.82-06', 0, 0, 2, NULL, NULL);
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (12, 2, 2, NULL, '$55.00', '2018-04-07 08:59:35.82-06', 0, 0, 2, NULL, NULL);
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (13, 2, 2, NULL, '$456.00', '2018-04-22 00:00:00-06', 0, 0, 2, NULL, NULL);
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (14, 2, 2, NULL, '$111.00', '2018-03-29 00:00:00-06', 0, 0, 2, NULL, NULL);
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (15, 2, 2, NULL, '$111.00', '2018-03-29 00:00:00-06', 0, 0, 2, NULL, NULL);
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (16, 2, 6, NULL, '$120.00', '2018-04-19 15:00:00-06', 0, 0, 5, NULL, NULL);
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (18, 3, 5, NULL, '$450.00', '2018-04-04 13:48:00-06', 0, 0, 2, 5, NULL);
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (19, 2, 7, NULL, '$15.03', '2018-04-09 20:34:32.636-06', 0, 0, 7, NULL, 'Donkeys, 50% off');
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (20, 2, 4, NULL, '$45.00', '2018-04-10 05:52:06.9-06', 0, 0, 2, NULL, 'Donacion a algo');
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (21, 2, 4, NULL, '$34.00', '2018-04-10 05:53:35.924-06', 0, 0, 5, NULL, 'dona');
INSERT INTO public.transaction (txn_id, txntyp_id, cat_id, schtxn_id, amount, date_time, is_draft, is_important, from_account, to_account, notes) VALUES (22, 2, 5, NULL, '$356.00', '2018-04-10 05:54:14.388-06', 0, 0, 7, NULL, 'onda');


--
-- TOC entry 2284 (class 0 OID 16446)
-- Dependencies: 213
-- Data for Name: transaction_tag; Type: TABLE DATA; Schema: public; Owner: smmmusr
--



--
-- TOC entry 2287 (class 0 OID 16453)
-- Dependencies: 216
-- Data for Name: transaction_type; Type: TABLE DATA; Schema: public; Owner: smmmusr
--

INSERT INTO public.transaction_type (txntyp_id, name, operation) VALUES (1, 'Income', '+');
INSERT INTO public.transaction_type (txntyp_id, name, operation) VALUES (2, 'Expense', '-');
INSERT INTO public.transaction_type (txntyp_id, name, operation) VALUES (3, 'Own transfer', '=');
INSERT INTO public.transaction_type (txntyp_id, name, operation) VALUES (4, 'External transfer', '-');


--
-- TOC entry 2320 (class 0 OID 0)
-- Dependencies: 197
-- Name: BANK_bank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public."BANK_bank_id_seq"', 8, true);


--
-- TOC entry 2321 (class 0 OID 0)
-- Dependencies: 199
-- Name: CATEGORY_ICON_catico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public."CATEGORY_ICON_catico_id_seq"', 1, false);


--
-- TOC entry 2322 (class 0 OID 0)
-- Dependencies: 201
-- Name: CATEGORY_cat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public."CATEGORY_cat_id_seq"', 20, true);


--
-- TOC entry 2323 (class 0 OID 0)
-- Dependencies: 203
-- Name: account_acct_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public.account_acct_id_seq', 11, true);


--
-- TOC entry 2324 (class 0 OID 0)
-- Dependencies: 205
-- Name: account_type_acctyp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public.account_type_acctyp_id_seq', 4, true);


--
-- TOC entry 2325 (class 0 OID 0)
-- Dependencies: 207
-- Name: business_bsinss_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public.business_bsinss_id_seq', 1, false);


--
-- TOC entry 2326 (class 0 OID 0)
-- Dependencies: 209
-- Name: schedule_txn_schtxn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public.schedule_txn_schtxn_id_seq', 1, false);


--
-- TOC entry 2327 (class 0 OID 0)
-- Dependencies: 211
-- Name: tag_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public.tag_tag_id_seq', 62, true);


--
-- TOC entry 2328 (class 0 OID 0)
-- Dependencies: 214
-- Name: transaction_tag_txntag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public.transaction_tag_txntag_id_seq', 1, false);


--
-- TOC entry 2329 (class 0 OID 0)
-- Dependencies: 215
-- Name: transaction_txn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public.transaction_txn_id_seq', 22, true);


--
-- TOC entry 2330 (class 0 OID 0)
-- Dependencies: 217
-- Name: transaction_type_txntyp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smmmusr
--

SELECT pg_catalog.setval('public.transaction_type_txntyp_id_seq', 4, true);


--
-- TOC entry 2120 (class 2606 OID 16470)
-- Name: account account_name_uk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_name_uk UNIQUE (name);


--
-- TOC entry 2122 (class 2606 OID 16472)
-- Name: account account_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pk PRIMARY KEY (acct_id);


--
-- TOC entry 2124 (class 2606 OID 16474)
-- Name: account_type account_type_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.account_type
    ADD CONSTRAINT account_type_pk PRIMARY KEY (acctyp_id);


--
-- TOC entry 2112 (class 2606 OID 16476)
-- Name: bank bank_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT bank_pk PRIMARY KEY (bank_id);


--
-- TOC entry 2126 (class 2606 OID 16478)
-- Name: business business_pkey; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.business
    ADD CONSTRAINT business_pkey PRIMARY KEY (bsinss_id);


--
-- TOC entry 2114 (class 2606 OID 16480)
-- Name: category_icon category_icon_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.category_icon
    ADD CONSTRAINT category_icon_pk PRIMARY KEY (catico_id);


--
-- TOC entry 2116 (class 2606 OID 16482)
-- Name: category category_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pk PRIMARY KEY (cat_id);


--
-- TOC entry 2118 (class 2606 OID 16484)
-- Name: category catnameunique; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT catnameunique UNIQUE (name);


--
-- TOC entry 2128 (class 2606 OID 16486)
-- Name: schedule_txn schedule_txn_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.schedule_txn
    ADD CONSTRAINT schedule_txn_pk PRIMARY KEY (schtxn_id);


--
-- TOC entry 2130 (class 2606 OID 16488)
-- Name: tag tag_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pk PRIMARY KEY (tag_id);


--
-- TOC entry 2132 (class 2606 OID 16490)
-- Name: tag tagunique; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tagunique UNIQUE (name);


--
-- TOC entry 2134 (class 2606 OID 16492)
-- Name: transaction transaction_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pk PRIMARY KEY (txn_id);


--
-- TOC entry 2136 (class 2606 OID 16494)
-- Name: transaction_tag transaction_tag_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction_tag
    ADD CONSTRAINT transaction_tag_pk PRIMARY KEY (txntag_id);


--
-- TOC entry 2138 (class 2606 OID 16496)
-- Name: transaction_type transaction_type_pk; Type: CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction_type
    ADD CONSTRAINT transaction_type_pk PRIMARY KEY (txntyp_id);


--
-- TOC entry 2140 (class 2606 OID 16497)
-- Name: account account_account_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_account_type_fk FOREIGN KEY (acctyp_id) REFERENCES public.account_type(acctyp_id);


--
-- TOC entry 2141 (class 2606 OID 16502)
-- Name: account account_bank_fk; Type: FK CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_bank_fk FOREIGN KEY (bank_id) REFERENCES public.bank(bank_id);


--
-- TOC entry 2139 (class 2606 OID 16507)
-- Name: category category_icon_fk; Type: FK CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_icon_fk FOREIGN KEY (catico_id) REFERENCES public.category_icon(catico_id);


--
-- TOC entry 2142 (class 2606 OID 16512)
-- Name: transaction transaction_category_fk; Type: FK CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_category_fk FOREIGN KEY (cat_id) REFERENCES public.category(cat_id);


--
-- TOC entry 2143 (class 2606 OID 16517)
-- Name: transaction transaction_schedule_txn_fk; Type: FK CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_schedule_txn_fk FOREIGN KEY (schtxn_id) REFERENCES public.schedule_txn(schtxn_id);


--
-- TOC entry 2145 (class 2606 OID 16522)
-- Name: transaction_tag transaction_tag_transaction_fk; Type: FK CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction_tag
    ADD CONSTRAINT transaction_tag_transaction_fk FOREIGN KEY (txn_id) REFERENCES public.transaction(txn_id);


--
-- TOC entry 2144 (class 2606 OID 16527)
-- Name: transaction transaction_transaction_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: smmmusr
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_transaction_type_fk FOREIGN KEY (txntyp_id) REFERENCES public.transaction_type(txntyp_id);


--
-- TOC entry 2297 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2018-11-08 09:15:31

--
-- PostgreSQL database dump complete
--
