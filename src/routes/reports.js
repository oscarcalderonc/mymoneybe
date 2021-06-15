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
        const bankStatement = 'INSERT INTO bank (firebase_id, acronym, name) VALUES ';

        banks.forEach(({ id, acronym, name }, idx) => {
            bankStatement.concat(`('${id}', '${acronym}', '${name}')`);
            bankStatement.concat(idx === banks.length - 1 ? ';' : ',');
        });

        ctx.body = { sql: `${bankStatement}` };
        next();
    });
};
