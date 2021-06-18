
module.exports = (router) => {
    router.get('/accountTypes', async (ctx, next) => {
        ctx.body = await ctx.db('account_type');
        next();
    });
};
