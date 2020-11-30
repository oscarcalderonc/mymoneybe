const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const koaJwt = require('koa-jwt');
const router = require('./routes');

const ENDPOINT_PREFIX = process.env.SERVER_PROXY_PATH || '';
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'do_the_delicious_to_her';

const app = new Koa();

app.use(cors({ origin: 'money-fe-g4q6tqkjza-uc.a.run.app' }));

app.use(async (ctx, next) => {
    try {
        await next();
        ctx.type = 'application/json';
        ctx.body = {
            data: ctx.body,
        };
    } catch (err) {
        ctx.status = err.status;
        ctx.body = {
            message: err.message,
        };
    }
});

app.use(logger());
app.use(bodyparser());
app.use(koaJwt({ secret: JWT_SECRET })
    .unless({ path: [`${ENDPOINT_PREFIX}/public`, `${ENDPOINT_PREFIX}/ping`, `${ENDPOINT_PREFIX}/getjwt`, `${ENDPOINT_PREFIX}/login`] }));

app.use(router.routes())
    .use(router.allowedMethods());

module.exports = app;
