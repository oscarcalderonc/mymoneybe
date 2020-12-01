const db = require('../db');
const { mapDocuments } = require('../utils/utils');

module.exports = (router) => {
    router.put('/transactions', async (ctx, next) => {
        const payload = ctx.request.body;

        const { transactionType } = payload;
        delete payload.transactionType;
        console.log(payload);
        //transform datetime

        try {
            await db.collection('transactions').doc().set(payload);
            const fromAccount = await db.collection('accounts').doc(payload.fromAccountId);
            const { currentBalance } = (await fromAccount.get()).data();

            if (transactionType.operation !== '=') {
                const mutableAmount = payload.amount * (transactionType.operation === '-' ? -1 : 1);

                console.log(`The current balance is ${currentBalance}`);
                console.log(`The amount is ${mutableAmount}`);

                fromAccount.set({ currentBalance: parseFloat((currentBalance + mutableAmount).toFixed(2)) }, { merge: true });
            } else {
                const toAccount = await db.collection('accounts').doc(payload.toAccountId);
                const { currentBalance: currentBalanceTo } = (await toAccount.get()).data();

                console.log(`The current balance is ${currentBalance}`);
                console.log(`The current balance to is ${currentBalanceTo}`);
                console.log(`The amount is ${payload.amount}`);

                fromAccount.set({ currentBalance: parseFloat((currentBalance - payload.amount).toFixed(2)) }, { merge: true });
                toAccount.set({ currentBalance: parseFloat((currentBalanceTo + payload.amount).toFixed(2)) }, { merge: true });
            }

        } catch (err) {
            console.log(err);
        }

        ctx.body = {
            message: 'Success'
        };
        next();
    });
};
