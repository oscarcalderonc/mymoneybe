module.exports = async (db) => {
    const txns = await db.collection('transactions').get();
    console.log('nouuu');
    txns.docs.forEach(async (txn) => {
        const { dateTime: currentDateTime } = txn.data();
        let newDateTime = currentDateTime;
        console.log('nouuu');
        if (typeof currentDateTime === 'string') {
            console.log('siuuu');
            const dt = new Date();

            dt.setDate(currentDateTime.substr(6, 2));
            dt.setMonth(parseInt(currentDateTime.substr(4, 2)) - 1);
            dt.setFullYear(currentDateTime.substr(0, 4));
            dt.setHours(currentDateTime.substr(9, 2));
            dt.setMinutes(currentDateTime.substr(11, 2));
            newDateTime = dt;
        }
        const txnRef = db.collection('transactions').doc(txn.id);
        txnRef.set({ dateTime: newDateTime }, { merge: true });
    });

};
