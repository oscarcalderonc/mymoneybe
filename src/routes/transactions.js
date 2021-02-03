
const { isEmpty } = require('lodash');
const { DateTime } = require('luxon');
const currency = require('currency.js');

const db = require('../db');
const { mapDocuments, mapDocument, addToFilter } = require('../utils/utils');

const DECREASE = -1;
const INCREASE = 1;
const operationsMapping = { '-': DECREASE, '+': INCREASE };
const operationsReversalMapping = { '-': INCREASE, '+': DECREASE };

const calculateNewBalance = ({
    amount, isReversal, operation, isDestination, currentBalance,
}) => {
    let amountToApply = Math.abs(amount);

    if (!isReversal) {
        if (operation === '=') {
            amountToApply *= isDestination ? INCREASE : DECREASE;
        } else {
            amountToApply *= operationsMapping[operation];
        }
    } else if (operation === '=') {
        amountToApply *= isDestination ? DECREASE : INCREASE;
    } else {
        amountToApply *= operationsReversalMapping[operation];
    }

    return parseFloat((currentBalance + amountToApply).toFixed(2));
};

module.exports = (router) => {
    router.get('/transactions', async (ctx, next) => {
        const {
            month,
            dateFrom,
            dateTo,
            fromAccountId,
            toAccountId,
            transactionTypeId,
            categoryId,
            amount,
        } = ctx.query;

        const defaultDateFrom = DateTime.local().set({ day: 1 }).set({ hour: 0 }).set({ minute: 0 }).set({ second: 1 }).toJSDate();
        const defaultDateTo = DateTime.local().set({ day: DateTime.local().daysInMonth }).toJSDate();

        let query = db.collection('transactions');

        query = addToFilter(query, transactionTypeId, 'transactionTypeId');
        query = addToFilter(query, categoryId, 'categoryId');
        query = addToFilter(query, toAccountId, 'toAccountId');
        query = addToFilter(query, fromAccountId, 'fromAccountId');
        if (isEmpty(month) || (isEmpty(dateFrom) && isEmpty(dateTo))) {
            query = addToFilter(query, defaultDateFrom, 'dateTime', '>=');
            query = addToFilter(query, defaultDateTo, 'dateTime', '<=');
        } else {
            query = addToFilter(query, dateFrom, 'dateTime', '>=');
            query = addToFilter(query, dateTo, 'dateTime', '<=');
        }

        let documents = mapDocuments(await query.orderBy('dateTime', 'asc').get());

        if (!isEmpty(amount)) {
            const currencyAmount = currency(amount);
            const fromAmount = currencyAmount.subtract(currencyAmount.cents()).value;
            const toAmount = currency(fromAmount).add(0.99).value;
            documents = documents.filter((doc) => doc.amount >= fromAmount && doc.amount <= toAmount);
        }

        ctx.body = documents;
        next();
    });

    router.get('/transactions/:transactionId', async (ctx, next) => {
        const { transactionId } = ctx.params;
        const transaction = await db.collection('transactions').doc(transactionId).get();

        ctx.body = mapDocument(transaction);
        next();
    });

    router.delete('/transactions/:transactionId', async (ctx, next) => {
        const { transactionId } = ctx.params;
        const transactionRef = db.collection('transactions').doc(transactionId);
        const {
            amount,
            fromAccountId,
            toAccountId,
            transactionTypeId,
        } = await (await transactionRef.get()).data();

        const transactionType = await (await db.collection('transactionTypes').doc(transactionTypeId).get()).data();

        await db.runTransaction(async (t) => {
            const fromAccountRef = db.collection('accounts').doc(fromAccountId);
            const { currentBalance: currentBalanceFrom } = (await t.get(fromAccountRef)).data();

            const newBalanceFrom = calculateNewBalance({
                amount,
                isDestination: false,
                isReversal: true,
                operation: transactionType.operation,
                currentBalance: currentBalanceFrom,
            });

            if (toAccountId) {
                const toAccountRef = db.collection('accounts').doc(toAccountId);
                const { currentBalance: currentBalanceTo } = (await t.get(toAccountRef)).data();

                const newBalanceTo = calculateNewBalance({
                    amount,
                    isDestination: true,
                    isReversal: true,
                    operation: transactionType.operation,
                    currentBalance: currentBalanceTo,
                });

                t.update(toAccountRef, { currentBalance: newBalanceTo }, { merge: true });
            }
            t.update(fromAccountRef, { currentBalance: newBalanceFrom }, { merge: true });

            const res = await transactionRef.delete();
            ctx.body = { message: 'Success', details: res };
        });

        next();
    });

    router.put('/transactions', async (ctx, next) => {
        const payload = ctx.request.body;

        payload.dateTime = new Date(payload.dateTime);

        const transactionType = await (await db.collection('transactionTypes').doc(payload.transactionTypeId).get()).data();

        if (transactionType.operation !== '=') {
            delete payload.toAccountId;
        }

        await db.runTransaction(async (t) => {
            const newTransactionRef = db.collection('transactions').doc();
            const fromAccountRef = db.collection('accounts').doc(payload.fromAccountId);
            const { currentBalance: currentBalanceFrom } = (await t.get(fromAccountRef)).data();

            const newBalanceFrom = calculateNewBalance({
                amount: payload.amount,
                isDestination: false,
                isReversal: false,
                operation: transactionType.operation,
                currentBalance: currentBalanceFrom,
            });

            if (payload.toAccountId) {
                const toAccountRef = db.collection('accounts').doc(payload.toAccountId);
                const { currentBalance: currentBalanceTo } = (await t.get(toAccountRef)).data();

                const newBalanceTo = calculateNewBalance({
                    amount: payload.amount,
                    isDestination: true,
                    isReversal: false,
                    operation: transactionType.operation,
                    currentBalance: currentBalanceTo,
                });

                t.update(toAccountRef, { currentBalance: newBalanceTo }, { merge: true });
            }
            t.update(fromAccountRef, { currentBalance: newBalanceFrom }, { merge: true });
            await t.set(newTransactionRef, payload);
        });

        ctx.body = {
            message: 'Success',
        };
        next();
    });

    const hasTransactionDetailsChanged = (oldAmount, newAmount, oldAccountFrom, newAccountFrom, oldAccountTo, newAccountTo, operation) => {
        let areThereChanges = false;

        areThereChanges = oldAmount !== newAmount ? true : areThereChanges;
        areThereChanges = oldAccountFrom !== newAccountFrom ? true : areThereChanges;

        if(operation === '=') {
            areThereChanges = oldAccountTo !== newAccountTo ? true : areThereChanges;
        }
            
        return areThereChanges;
    };

    router.patch('/transactions/:transactionId', async (ctx, next) => {
        const payload = ctx.request.body;
        const { transactionId } = ctx.params;

        const { fromAccountId, toAccountId, amount } = payload;

        payload.dateTime = new Date(payload.dateTime);

        const transactionRef = db.collection('transactions').doc(transactionId);

        const {
            amount: currentAmount,
            fromAccountId: currentFromAccountId,
            toAccountId: currentToAccountId,
            transactionTypeId,
        } = (await transactionRef.get()).data();

        const transactionType = await (await db.collection('transactionTypes').doc(transactionTypeId).get()).data();


        await db.runTransaction(async (t) => {

            if (hasTransactionDetailsChanged(currentAmount, amount, currentFromAccountId, fromAccountId, currentToAccountId, toAccountId, transactionType.operation)) {
                const currentFromAccountRef = db.collection('accounts').doc(currentFromAccountId);
                const { currentBalance: oldBalanceFrom } = (await t.get(currentFromAccountRef)).data();

                const newFromAccountRef = db.collection('accounts').doc(fromAccountId);
                let { currentBalance: currentBalanceFrom } = (await t.get(newFromAccountRef)).data();

                let currentToAccountRef;
                let newToAccountRef;
                let revertedBalanceTo;
                let newBalanceTo;

                const revertedBalanceFrom = calculateNewBalance({
                    amount: currentAmount,
                    isDestination: false,
                    isReversal: true,
                    operation: transactionType.operation,
                    currentBalance: oldBalanceFrom,
                });

                if (currentFromAccountId === fromAccountId) {
                    currentBalanceFrom = revertedBalanceFrom;
                }

                const newBalanceFrom = calculateNewBalance({
                    amount,
                    isDestination: false,
                    isReversal: false,
                    operation: transactionType.operation,
                    currentBalance: currentBalanceFrom,
                });

                if (currentToAccountId) {
                    currentToAccountRef = db.collection('accounts').doc(currentToAccountId);
                    const { currentBalance: oldBalanceTo } = (await t.get(currentToAccountRef)).data();

                    newToAccountRef = db.collection('accounts').doc(toAccountId);
                    let { currentBalance: currentBalanceTo } = (await t.get(newToAccountRef)).data();

                    revertedBalanceTo = calculateNewBalance({
                        amount: currentAmount,
                        isDestination: true,
                        isReversal: true,
                        operation: transactionType.operation,
                        currentBalance: oldBalanceTo,
                    });

                    if (currentToAccountId === toAccountId) {
                        currentBalanceTo = revertedBalanceTo;
                    }

                    newBalanceTo = calculateNewBalance({
                        amount,
                        isDestination: true,
                        isReversal: false,
                        operation: transactionType.operation,
                        currentBalance: currentBalanceTo,
                    });
                }

                t.update(currentFromAccountRef, { currentBalance: revertedBalanceFrom }, { merge: true });

                if (currentToAccountRef) {
                    t.update(currentToAccountRef, { currentBalance: revertedBalanceTo }, { merge: true });
                }

                t.update(newFromAccountRef, { currentBalance: newBalanceFrom }, { merge: true });

                if (newToAccountRef) {
                    t.update(newToAccountRef, { currentBalance: newBalanceTo }, { merge: true });
                }
            }

            await t.set(transactionRef, payload, { merge: true });
        });

        ctx.body = {
            message: 'Transaction ',
        };
        next();
    });
};
