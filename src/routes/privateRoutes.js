const db = require('../db');

module.exports = (router) => {
    router.get('/secreto', (ctx, next) => {
        ctx.body = 'Ahora tienes acceso al delicioso';
        next();
    });

    router.post('/run', async (ctx, next) => {
        const { scriptName } = ctx.req.body;
        const changelog = require(`../changelog/files/${scriptName}.sql`);
        await changelog(db);
        ctx.body = 'Success (I guess)';
        next();
    });
};
