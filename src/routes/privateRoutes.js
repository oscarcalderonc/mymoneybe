const db = require('../db');

module.exports = (router) => {
    router.get('/secreto', (ctx, next) => {
        ctx.body = 'Ahora tienes acceso al delicioso';
        next();
    });

    router.post('/run', async (ctx, next) => {
        const { scriptName } = ctx.request.body;
        const changelog = require(`../changelog/files/${scriptName}.js`);
        await changelog(db);
        ctx.body = 'Success (I guess)';
        next();
    });
};
//https://test-money-g4q6tqkjza-uc.a.run.app