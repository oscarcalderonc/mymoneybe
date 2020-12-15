const { isEmpty } = require('lodash');

const db = require('../db');
const { mapDocuments } = require('../utils/utils');

module.exports = (router) => {
    router.get('/transactions', async (ctx, next) => {
        // TODO Default load current month
        ctx.body = mapDocuments(await db.collection('transactions')
            .orderBy('dateTime', 'asc').get());
        next();
    });

    const DECREASE = -1;
    const INCREASE = 1;
    const operationsMapping = { '-': DECREASE, '+': INCREASE };
    const operationsReversalMapping = { '-': INCREASE, '+': DECREASE };

    const calculateNewBalance = ({
        amount, isReversal, operation, isDestination, currentBalance,
    }) => {
        let amountToApply = Math.abs(amount);

        if (operation === '=') {
            amountToApply *= isDestination ? INCREASE : DECREASE;
        } else {
            amountToApply *= operationsMapping[operation];
        }

        if (isReversal) {
            if (operation === '=') {
                amountToApply *= isDestination ? DECREASE : INCREASE;
            } else {
                amountToApply *= operationsReversalMapping[operation];
            }
        }

        return parseFloat((currentBalance + amountToApply).toFixed(2));
    };

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
        const { transactionId } = ctx.request.params;

        const { fromAccountId, toAccountId, amount } = payload;
        delete payload.transactionType;

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
                await t.set(transactionRef, payload, { merge: true });
            });

            if (currentFromAccountId !== fromAccountId) {
                const fromAccountRef = await db.collection('accounts').doc(currentFromAccountId);
                const { currentBalance } = (await fromAccountRef.get()).data();
                const reversedAmount = currentAmount * (operation === '-' || operation === '=' ? 1 : -1);
                await fromAccountRef.set({
                    currentBalance: parseFloat((currentBalance + reversedAmount).toFixed(2)),
                }, { merge: true });
            }

            if (!isEmpty(currentToAccountId) && currentToAccountId !== toAccountId) {
                const toAccountRef = await db.collection('accounts').doc(currentToAccountId);
                const { currentBalance } = (await toAccountRef.get()).data();
                let reversedAmount = currentAmount * (operation === '-' ? 1 : -1);
                reversedAmount = operation === '=' ? (currentAmount * -1) : reversedAmount;
                await toAccountRef.set({
                    currentBalance: parseFloat((currentBalance + reversedAmount).toFixed(2)),
                }, { merge: true });
            }
        } catch (err) {
            console.log(err);
        }

        ctx.body = {
            message: 'Success',
        };
        next();
    });
};
