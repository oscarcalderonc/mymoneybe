const db = require('../db');
const { mapDocuments, mapDocument } = require('../utils/utils');

module.exports = (router) => {
    router.get('/categories', async (ctx, next) => {
        //const { categoryType } = ctx.query;

        const query = db.collection('categories');

        // if (!isEmpty(categoryType)) {
        //     query = query.where('type', '==', categoryType);
        // }
        ctx.body = mapDocuments(await query.get());
        next();
    });

    router.get('/categories/:categoryId', async (ctx, next) => {
        const { categoryId } = ctx.params;
        const category = await db.collection('categories').doc(categoryId).get();

        ctx.body = mapDocument(category);

        next();
    });

    router.delete('/DISABLED/categories/:categoryId', async (ctx, next) => {
        const { categoryId } = ctx.params;
        const transactionRef = db.collection('categories').doc(categoryId);
        const res = await transactionRef.delete();
        ctx.body = { message: 'Success', details: res };

        next();
    });

    router.put('/categories', async (ctx, next) => {
        const payload = ctx.request.body;

        const res = await db.collection('categories').doc().set(payload);
        ctx.body = { message: 'Success', details: res };
        next();
    });

    router.patch('/categories/:categoryId', async (ctx, next) => {
        const payload = ctx.request.body;
        const { categoryId } = ctx.params;

        const categoryRef = await db.collection('categories').doc(categoryId);
        const res = categoryRef.set(payload, { merge: true });
        ctx.body = { message: 'Success', details: res };
        next();
    });
};
