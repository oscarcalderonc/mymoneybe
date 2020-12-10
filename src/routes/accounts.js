const db = require('../db');
const { mapDocuments } = require('../utils/utils');

module.exports = (router) => {
    router.get('/accounts', async (ctx, next) => {
        ctx.body = mapDocuments(await db.collection('accounts').orderBy('order', 'asc').get());
        next();
    });
};
