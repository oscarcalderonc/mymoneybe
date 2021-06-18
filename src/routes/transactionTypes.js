
module.exports = (router) => {
    router.get('/transactionTypes', async (ctx, next) => {
        ctx.body = await ctx.db('transaction_type');
        next();
    });
};
