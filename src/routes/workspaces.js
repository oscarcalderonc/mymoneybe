const db = require('../db');
const { mapDocuments } = require('../utils/utils');

module.exports = (router) => {
    router.get('/workspaces', async (ctx, next) => {
        ctx.body = mapDocuments(await db.collection('workspaces').get());
        next();
    });
};
