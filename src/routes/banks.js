const db = require('../db');
const { mapDocuments } = require('../utils/utils');

module.exports = (router) => {
    router.get('/banks', async (ctx, next) => {
        ctx.body = mapDocuments(await db.collection('banks').get());
        next();
    });
};
