
module.exports = (router) => {
    router.get('/banks', async (ctx, next) => {
        ctx.body = await ctx.db('bank');
        next();
    });
};
