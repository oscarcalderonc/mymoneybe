const db = require('../db');
const { mapDocuments } = require('../utils/utils');

module.exports = (router) => {
    router.get('/accountTypes', async (ctx, next) => {
        ctx.body = mapDocuments(await db.collection('accountTypes').get());
        next();
    });
};
