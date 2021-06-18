
module.exports = (router) => {
    router.get('/workspaces', async (ctx, next) => {
        ctx.body = await ctx.db('workspace');
        next();
    });
};
