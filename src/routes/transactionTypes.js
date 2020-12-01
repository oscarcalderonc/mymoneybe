const db = require('../db');
const { mapDocuments } = require('../utils/utils');

module.exports = (router) => {
    router.get('/transactionTypes', async (ctx, next) => {
        ctx.body = mapDocuments(await db.collection('transactionTypes').get());
        next();
    });
};
