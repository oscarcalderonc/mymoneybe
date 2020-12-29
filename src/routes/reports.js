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
        const filter = addToFilter(query);

        if (isEmpty(month) || (isEmpty(dateFrom) && isEmpty(dateTo))) {
            query = filter(defaultDateFrom, 'dateTime', '>=');
            query = filter(defaultDateTo, 'dateTime', '<=');
        } else {
            query = filter(dateFrom, 'dateTime', '>=');
            query = filter(dateTo, 'dateTime', '<=');
        }

        const categories = mapDocuments(await db.collection('categories').get());
        const expenseType = mapDocument(await db.collection('transactionTypes').where('operation', '==', '-').get());
        query = filter(expenseType.id, 'transactionTypeId', '==');

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
};
