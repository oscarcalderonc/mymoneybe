const { isEmpty } = require('lodash');
const { DateTime } = require('luxon');
const currency = require('currency.js');

const db = require('../db');
const { addToFilter, mapDocuments, mapDocument } = require('../utils/utils');

module.exports = (router) => {
    router.get('/expenses', async (ctx, next) => {
        const {
            month,
            dateFrom,
            dateTo,
            includeSubLevels
        } = ctx.query;

        const defaultDateFrom = DateTime.local().set({ day: 1 }).toJSDate();
        const defaultDateTo = DateTime.local().set({ day: DateTime.local().daysInMonth }).toJSDate();

        let query = db.collection('transactions');

        if (isEmpty(month) || (isEmpty(dateFrom) && isEmpty(dateTo))) {
            query = addToFilter(query, defaultDateFrom, 'dateTime', '>=');
            query = addToFilter(query, defaultDateTo, 'dateTime', '<=');
        } else {
            query = addToFilter(query, dateFrom, 'dateTime', '>=');
            query = addToFilter(query, dateTo, 'dateTime', '<=');
        }

        const categories = mapDocuments(await db.collection('categories').get());
        const expenseType = mapDocuments(await db.collection('transactionTypes')
            .where('operation', '==', '-')
            .where('name', '==', 'Expense')
            .get())[0];
        query = addToFilter(query, expenseType.id, 'transactionTypeId', '==');

        const rawData = await query.get();

        const groupedExpenses = new Map();
        rawData.docs.forEach((txn) => {
            const { amount, categoryId } = txn.data();
            const { name: categoryName } = categories.find((cat) => cat.id === categoryId);

            if (!groupedExpenses.has(categoryName)) {
                const category = { name: categoryName, amount: 0 };
                groupedExpenses.set(categoryName, category);
            }

            const category = groupedExpenses.get(categoryName);

            category.amount = currency(category.amount).add(amount);
        });

        const labels = [];
        const values = [];

        groupedExpenses.forEach((value, label) => {
            labels.push(label);
            values.push(value.amount);
        });

        ctx.body = { labels, values };
        next();
    });

    router.get('/raw-export', async (ctx, next) => {

        const banks = mapDocuments(await db.collection('banks').get());
        let bankStatement = 'INSERT INTO bank (firebase_id, acronym, name) VALUES ';

        banks.forEach(({ id, acronym, name }, idx) => {
            bankStatement = bankStatement.concat(`('${id}', '${acronym}', '${name}')`);
            bankStatement = bankStatement.concat(idx === banks.length - 1 ? ';' : ',');
        });

        const accountTypes = mapDocuments(await db.collection('accountTypes').get());
        let accountTypeStatement = 'INSERT INTO account_type (firebase_id, name, cash, credit_card, loan, read_only) VALUES ';

        accountTypes.forEach(({ id, name, cash = false, creditCard = false, loan = false, readOnly = true }, idx) => {
            accountTypeStatement = accountTypeStatement.concat(`('${id}', '${name}', ${cash}, ${creditCard}, ${loan}, ${readOnly})`);
            accountTypeStatement = accountTypeStatement.concat(idx === accountTypes.length - 1 ? ';' : ',');
        });

        const accounts = mapDocuments(await db.collection('accounts').get());
        let accountStatement = 'INSERT INTO account_type (firebase_id, name, acctyp_id, bank_id, current_balance, initial_balance, order) VALUES ';

        accounts.forEach(({ id, name, accountTypeId, bankId, currentBalance, initialBalance, order }, idx) => {
            accountStatement = accountStatement.concat(`('${id}', '${name}', (SELECT id from account_type WHERE firebase_id = '${accountTypeId}'), `);
            accountStatement = accountStatement.concat(` (SELECT id from bank WHERE firebase_id = '${bankId}'), ${currentBalance}, ${initialBalance}, ${order})`);
            accountStatement = accountStatement.concat(idx === accounts.length - 1 ? ';' : ',');
        });

        const transactionTypes = mapDocuments(await db.collection('transactionTypes').get());
        let transactionTypeStatement = 'INSERT INTO transaction_type (firebase_id, name, operation) VALUES ';

        transactionTypes.forEach(({ id, name, operation }, idx) => {
            transactionTypeStatement = transactionTypeStatement.concat(`('${id}', '${name}', '${operation}' )`);
            transactionTypeStatement = transactionTypeStatement.concat(idx === transactionTypes.length - 1 ? ';' : ',');
        });

        const categories = mapDocuments(await db.collection('categories').get());
        let categoryStatement = 'INSERT INTO category (firebase_id, name, type) VALUES ';

        categories.forEach(({ id, name, type }, idx) => {
            categoryStatement = categoryStatement.concat(`('${id}', '${name}', '${type}' )`);
            categoryStatement = categoryStatement.concat(idx === categories.length - 1 ? ';' : ',');
        });

        const workspaces = mapDocuments(await db.collection('workspaces').get());
        let workspaceStatement = 'INSERT INTO workspace (firebase_id, name) VALUES ';

        workspaces.forEach(({ id, name }, idx) => {
            workspaceStatement = workspaceStatement.concat(`('${id}', '${name}' )`);
            workspaceStatement = workspaceStatement.concat(idx === workspaces.length - 1 ? ';' : ',');
        });

        const tags = mapDocuments(await db.collection('tags').get());
        let tagStatement = 'INSERT INTO tag (firebase_id, name) VALUES ';

        tags.forEach(({ id, name }, idx) => {
            tagStatement = tagStatement.concat(`('${id}', '${name}' )`);
            tagStatement = tagStatement.concat(idx === tags.length - 1 ? ';' : ',');
        });

        const users = mapDocuments(await db.collection('users').get());
        let userStatement = 'INSERT INTO user (firebase_id, username, pwd_hash) VALUES ';

        users.forEach(({ id, username, pwd_hash }, idx) => {
            userStatement = userStatement.concat(`('${id}', '${username}', '${pwd_hash}' )`);
            userStatement = userStatement.concat(idx === users.length - 1 ? ';' : ',');
        });

        const transactions = mapDocuments(await db.collection('transactions').get());
        let transactionStatement = 'INSERT INTO transaction (amount, categ_id, date_time, fromacct_id, toacct_id, summary, txntyp_id, wrkspc_id) VALUES ';

        transactions.forEach(({ amount, categoryId, dateTime, fromAccountId, toAccountId, summary, transactionTypeId, workspaceId }, idx) => {
            //timestamp.toFormat('yyyyLLdd hhmmss')
            const timestamp = DateTime.fromJSDate(dateTime);
            transactionStatement = transactionStatement.concat(`('${amount}', (SELECT id from category WHERE firebase_id = '${categoryId}'), TO_DATE('${dateTime}', 'YYYYMMDD HH24MISS'), `);
            transactionStatement = transactionStatement.concat(`(SELECT id from account WHERE firebase_id = '${fromAccountId}'), `);
            transactionStatement = transactionStatement.concat(!toAccountId ? 'null, ' : `(SELECT id from account WHERE firebase_id = '${toAccountId}'), `);
            transactionStatement = transactionStatement.concat(`'${summary}', (SELECT id from transaction_type WHERE firebase_id = '${transactionTypeId}'), `);
            transactionStatement = transactionStatement.concat(!workspaceId ? 'null) ' : `(SELECT id from workspace WHERE firebase_id = '${workspaceId}') ) `);
            transactionStatement = transactionStatement.concat(idx === transactions.length - 1 ? ';' : ',');
        });

        ctx.body = { sql: `${bankStatement}
                            ${accountTypeStatement}
                            ${transactionTypeStatement}
                            ${categoryStatement}
                            ${workspaceStatement}
                            ${accountStatement}
                            ${userStatement}
                            ${tagStatement}
                            ${transactionStatement}` };
        next();
    });
};
