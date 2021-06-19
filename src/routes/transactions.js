
const { isEmpty, isNumber } = require('lodash');
const { DateTime } = require('luxon');
const currency = require('currency.js');

const db = require('../db');
const { mapDocuments, mapDocument, addToFilter } = require('../utils/utils');
const { default: knex } = require('knex');

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

    return currency(currentBalance).add(amountToApply).value;

    //return parseFloat((currentBalance + amountToApply).toFixed(2));
};

module.exports = (router) => {
    router.get('/transactions', async (ctx, next) => {
        const {
            monthYear,
            dateFrom,
            dateTo,
            fromacct_id,
            toacct_id,
            txntyp_id,
            categ_id,
            amount,
        } = ctx.query;

        let defaultDateFrom = DateTime.local();
        let defaultDateTo = DateTime.local();

        if (monthYear) {
            const [ year, month ] = monthYear.split('-');
            defaultDateFrom = defaultDateFrom.set({ month: parseInt(month), year: parseInt(year) });
            defaultDateTo = defaultDateTo.set({ month: parseInt(month), year: parseInt(year) });
        }
        defaultDateFrom = defaultDateFrom.set({ day: 1, hour: 0, minute: 0, second: 1 });
        defaultDateTo = defaultDateTo.set({ day: defaultDateTo.daysInMonth, hour: 23, minute: 59, second: 59 });

        let query = ctx.db('transaction').whereRaw('1 = ?', [1]);

        if (txntyp_id) {
            query.andWhere('txntyp_id', txntyp_id);
        }

        if (categ_id) {
            query.andWhere('categ_id', categ_id);
        }

        if (toacct_id) {
            query.andWhere('toacct_id', toacct_id);
        }

        if (fromacct_id) {
            query.andWhere('fromacct_id', fromacct_id);
        }

        query.andWhere('date_time', '>=', defaultDateFrom.toJSDate());
        query.andWhere('date_time', '<=', defaultDateTo.toJSDate());

        if (currency(amount).value > 0) {
            const currencyAmount = currency(amount);
            const fromAmount = currencyAmount.subtract(currencyAmount.cents()).value;
            const toAmount = currency(fromAmount).add(0.99).value;
            query.andWhere('amount', '>=', fromAmount).andWhere('amount', '<=', toAmount);
        }

        const transactions = await query.orderBy('date_time');

        ctx.body = transactions;
        next();
    });

    router.get('/transactions/:transactionId', async (ctx, next) => {
        const { transactionId } = ctx.params;
        const transaction = await ctx.db('transaction').where('id', transactionId).first();

        ctx.body = transaction;
        next();
    });

    router.delete('/transactions/:transactionId', async (ctx, next) => {
        const { transactionId } = ctx.params;
        const transaction = await ctx.db('transaction').where('id', transactionId).first();
        const {
            amount,
            fromacct_id,
            toacct_id,
            txntyp_id,
        } = transaction;

        const transactionType = await ctx.db('transaction_type').where('id', txntyp_id).first();

        await ctx.db.transaction(async (txn) => {
            const fromAccount = await ctx.db('account').where('id', fromacct_id).first();
            const { current_balance: currentBalanceFrom } = fromAccount;

            const newBalanceFrom = calculateNewBalance({
                amount,
                isDestination: false,
                isReversal: true,
                operation: transactionType.operation,
                currentBalance: currentBalanceFrom,
            });

            if (toacct_id) {
                const toAccount = await ctx.db('account').where('id', toacct_id).first();
                const { current_balance: currentBalanceTo } = (await t.get(toAccount)).data();

                const newBalanceTo = calculateNewBalance({
                    amount,
                    isDestination: true,
                    isReversal: true,
                    operation: transactionType.operation,
                    currentBalance: currentBalanceTo,
                });

                await txn('account').where('id', toAccount.id).update({ current_balance: newBalanceTo });
            }
            await txn('account').where('id', fromAccount.id).update({ current_balance: newBalanceFrom });

            const res = await txn('transaction').where('id', transactionId).del();
            ctx.body = { message: 'Success', details: res };
        });

        next();
    });

    router.put('/transactions', async (ctx, next) => {
        const payload = ctx.request.body;

        payload.date_time = new Date(payload.date_time);

        const transactionType = await ctx.db('transaction_type').where('id', payload.txntyp_id).first();

        if (transactionType.operation !== '=') {
            delete payload.toacct_id;
        }

        const fromAccount = await ctx.db('account').where('id', payload.fromacct_id).first();
        const { current_balance: currentBalanceFrom } = fromAccount;

        const newBalanceFrom = calculateNewBalance({
            amount: payload.amount,
            isDestination: false,
            isReversal: false,
            operation: transactionType.operation,
            currentBalance: currentBalanceFrom,
        });

        await ctx.db.transaction(async (txn) => {
            if (payload.toacct_id) {
                const toAccount = await ctx.db('account').where('id', payload.toacct_id).first();
                const { current_balance: currentBalanceTo } = toAccount;

                const newBalanceTo = calculateNewBalance({
                    amount: payload.amount,
                    isDestination: true,
                    isReversal: false,
                    operation: transactionType.operation,
                    currentBalance: currentBalanceTo,
                });

                await txn('account').where('id', toAccount.id).update({ current_balance: newBalanceTo });
            }

            await txn('account').where('id', fromAccount.id).update({ current_balance: newBalanceFrom });
            await txn('transaction').insert(payload);
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

        if (operation === '=') {
            areThereChanges = oldAccountTo !== newAccountTo ? true : areThereChanges;
        }

        return areThereChanges;
    };

    router.patch('/transactions/:transactionId', async (ctx, next) => {
        const payload = ctx.request.body;
        const { transactionId } = ctx.params;

        const { fromacct_id, toacct_id, amount } = payload;

        payload.date_time = new Date(payload.date_time);

        const transaction = await ctx.db('transaction').where('id', transactionId).first();

        const {
            amount: current_amount,
            fromacct_id: current_fromacct_id,
            toacct_id: current_toacct_id,
            txntyp_id,
        } = transaction;

        const transactionType = await ctx.db('transaction_type').where('id', txntyp_id).first();

        const currentFromAccount = await ctx.db('account').where('id', current_fromacct_id).first();
        const { current_balance: oldBalanceFrom } = currentFromAccount;

        const newFromAccount = await ctx.db('account').where('id', fromacct_id).first();
        let { current_balance: currentBalanceFrom } = newFromAccount;

        await ctx.db.transaction(async (txn) => {
            if (hasTransactionDetailsChanged(current_amount, amount, current_fromacct_id, fromacct_id, current_toacct_id, toacct_id, transactionType.operation)) {
                let currentToAccount;
                let newToAccount;
                let revertedBalanceTo;
                let newBalanceTo;

                const revertedBalanceFrom = calculateNewBalance({
                    amount: current_amount,
                    isDestination: false,
                    isReversal: true,
                    operation: transactionType.operation,
                    currentBalance: oldBalanceFrom,
                });

                if (current_fromacct_id === fromacct_id) {
                    currentBalanceFrom = revertedBalanceFrom;
                }

                const newBalanceFrom = calculateNewBalance({
                    amount,
                    isDestination: false,
                    isReversal: false,
                    operation: transactionType.operation,
                    currentBalance: currentBalanceFrom,
                });

                if (current_toacct_id) {
                    currentToAccount = ctx.db('account').where('id', current_toacct_id).first();
                    const { current_balance: oldBalanceTo } = currentToAccount;

                    newToAccount = ctx.db('account').where('id', toacct_id).first();
                    let { current_balance: currentBalanceTo } = newToAccount;

                    revertedBalanceTo = calculateNewBalance({
                        amount: current_amount,
                        isDestination: true,
                        isReversal: true,
                        operation: transactionType.operation,
                        currentBalance: oldBalanceTo,
                    });

                    if (current_toacct_id === toacct_id) {
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

                await txn('account').where('id', currentFromAccount.id).update({ current_balance: revertedBalanceFrom });

                if (currentToAccount) {
                    await txn('account').where('id', currentToAccount.id).update({ current_balance: revertedBalanceTo });
                }

                await txn('account').where('id', newFromAccount.id).update({ current_balance: newBalanceFrom });

                if (newToAccount) {
                    await txn('account').where('id', newToAccount.id).update({ current_balance: newBalanceTo });
                }
            }

            await txn('transaction').where('id', transactionId).update(payload);
        });

        ctx.body = {
            message: 'Transaction ',
        };
        next();
    });
};
