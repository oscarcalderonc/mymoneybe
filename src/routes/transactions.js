const { isEmpty } = require('lodash');

const db = require('../db');
const { mapDocuments, mapDocument } = require('../utils/utils');

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
    } else {
        if (operation === '=') {
            amountToApply *= isDestination ? DECREASE : INCREASE;
        } else {
            amountToApply *= operationsReversalMapping[operation];
        }
    }

    return parseFloat((currentBalance + amountToApply).toFixed(2));
};

module.exports = (router) => {
    router.get('/transactions', async (ctx, next) => {
        // TODO Default load current month
        ctx.body = mapDocuments(await db.collection('transactions')
            .orderBy('dateTime', 'asc').get());
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
        const { amount, fromAccountId, toAccountId, transactionTypeId } = await (await transactionRef.get()).data();

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

        try {
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
        } catch (err) {
            console.log(err);
        }

        ctx.body = {
            message: 'Success',
        };
        next();
    });

    router.patch('/transactions/:transactionId', async (ctx, next) => {
        const payload = ctx.request.body;
        const { transactionId } = ctx.params;

        const { fromAccountId, toAccountId, amount } = payload;

        payload.dateTime = new Date(payload.dateTime);

        try {
            const transactionRef = db.collection('transactions').doc(transactionId);

            const {
                amount: currentAmount,
                fromAccountId: currentFromAccountId,
                toAccountId: currentToAccountId,
                transactionTypeId,
            } = (await transactionRef.get()).data();

            const transactionType = await (await db.collection('transactionTypes').doc(transactionTypeId).get()).data();


            await db.runTransaction(async (t) => {
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

                await t.set(transactionRef, payload, { merge: true });
            });
        } catch (err) {
            console.log(err);
        }

        ctx.body = {
            message: 'Success',
        };
        next();
    });
};
