
module.exports = (router) => {
    router.get('/categories', async (ctx, next) => {
        let categories = JSON.parse(await ctx.redis.get('categories'));

        if (!categories) {
            categories = await ctx.db('category');
            ctx.redis.set('categories', JSON.stringify(categories), 'EX', 60 * 24 * 24);
        }
        ctx.body = categories;
        next();
    });

    router.get('/categories/:categoryId', async (ctx, next) => {
        const { categoryId } = ctx.params;

        const category = await ctx.db('category').where('id', categoryId).first();
        ctx.body = category;

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
