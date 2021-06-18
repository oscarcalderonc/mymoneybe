
module.exports = (router) => {
    router.get('/accounts', async (ctx, next) => {
        ctx.body = await ctx.db('account').orderBy('list_order');
        next();
    });
};
