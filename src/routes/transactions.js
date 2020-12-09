const { isEmpty } = require('lodash');

const db = require('../db');
const { mapDocuments } = require('../utils/utils');

module.exports = (router) => {
    router.get('/transactions', async (ctx, next) => {
        ctx.body = mapDocuments(await db.collection('transactions').get());
        next();
    });

    router.put('/transactions', async (ctx, next) => {
        const payload = ctx.request.body;

        const { transactionType } = payload;
        delete payload.transactionType;

        payload.dateTime = new Date(payload.dateTime);

        try {
            if (transactionType.operation !== '=') {
                delete payload.toAccountId;
            }

            const transactionRef = await db.collection('transactions').add(payload);
            console.log(transactionRef.id);
            const fromAccountRef = await db.collection('accounts').doc(payload.fromAccountId);
            const { currentBalance } = (await fromAccountRef.get()).data();

            if (transactionType.operation !== '=') {
                const mutableAmount = payload.amount * (transactionType.operation === '-' ? -1 : 1);

                await fromAccountRef.set({ currentBalance: parseFloat((currentBalance + mutableAmount).toFixed(2)) }, { merge: true });

                const { currentBalance: newBalanceFromAccount } = (await fromAccountRef.get()).data();
                transactionRef.set({ fromAccountBalance: newBalanceFromAccount }, { merge: true });
            } else {
                const toAccountRef = await db.collection('accounts').doc(payload.toAccountId);
                const { currentBalance: currentBalanceTo } = (await toAccountRef.get()).data();

                await fromAccountRef.set({ currentBalance: parseFloat((currentBalance - payload.amount).toFixed(2)) }, { merge: true });
                await toAccountRef.set({ currentBalance: parseFloat((currentBalanceTo + payload.amount).toFixed(2)) }, { merge: true });

                const { currentBalance: newBalanceFromAccount } = (await fromAccountRef.get()).data();
                const { currentBalance: newBalanceToAccount } = (await toAccountRef.get()).data();
                transactionRef.set({ fromAccountBalance: newBalanceFromAccount, toAccountBalance: newBalanceToAccount }, { merge: true });
            }


            // await db.collection('transactions').doc().set(payload);
            // let fromAccountRef = await db.collection('accounts').doc(payload.fromAccountId);
            // let toAccountRef = null;
            // if (!isEmpty(payload.toAccountId)) {
            //     toAccountRef = await db.collection('accounts').doc(payload.toAccountId);
            // }

            // db.runTransaction(function(transaction) {

            // const { currentBalance } = (await fromAccountRef.get()).data();

            // if (transactionType.operation !== '=') {
            //     const mutableAmount = payload.amount * (transactionType.operation === '-' ? -1 : 1);

            //     fromAccountRef.set({ currentBalance: parseFloat((currentBalance + mutableAmount).toFixed(2)) }, { merge: true });
            // } else {
                
            //     const { currentBalance: currentBalanceTo } = (await toAccountRef.get()).data();

            //     fromAccountRef.set({ currentBalance: parseFloat((currentBalance - payload.amount).toFixed(2)) }, { merge: true });
            //     toAccountRef.set({ currentBalance: parseFloat((currentBalanceTo + payload.amount).toFixed(2)) }, { merge: true });
            // }

        } catch (err) {
            console.log(err);
        }

        ctx.body = {
            message: 'Success'
        };
        next();
    });
};
