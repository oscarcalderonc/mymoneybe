const { isEmpty } = require('lodash');

const db = require('../db');
const { mapDocuments } = require('../utils/utils');

module.exports = (router) => {
    router.get('/categories/:type?', async (ctx, next) => {
        const { categoryType } = ctx.query;

        let query = db.collection('categories');

        if (!isEmpty(categoryType)) {
            query = query.where('type', '==', categoryType);
        }
        ctx.body = mapDocuments(await query.get());
        next();
    });
};
