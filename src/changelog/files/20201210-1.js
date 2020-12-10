module.exports = async (db) => {
    const txns = await db.collection('transactions').get();

    txns.docs.forEach(async (txn) => {
        const txnRef = db.collection('transactions').doc(txn.id);
        txnRef.set({ workspaceId: 'Q5FO7HJ309q7a5iSb9mV' }, { merge: true });
    });
};
