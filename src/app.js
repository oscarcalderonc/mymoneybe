const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const koaJwt = require('koa-jwt');
const { v4: uuid } = require('uuid');
const pino = require('koa-pino-logger')();

const router = require('./routes');

const ENDPOINT_PREFIX = process.env.SERVER_PROXY_PATH || '';
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'do_the_delicious_to_her';

const app = new Koa();

app.context.db = require('./db');

app.use(pino);
app.use(cors({ origin: process.env.ALLOWED_ORIGINS }));

app.use(async (ctx, next) => {
    const startTime = Date.now();
    try {
        const requestId = uuid();
        await next();
        const endTime = Date.now();
        ctx.log.info({ startTime, endTime, url: ctx.url }, `${ctx.method} ${ctx.url}`);
        ctx.type = 'application/json';
        ctx.body = {
            requestId,
            data: ctx.body,
            status: 'success',
            timestamp: endTime,
        };
    } catch (err) {
        const endTime = Date.now();
        ctx.log.error({ startTime, endTime, url: ctx.url, err }, err.message);
        ctx.status = err.status ? parseInt(err.status, 10) : 500;
        ctx.body = {
            status: 'error',
            data: err,
            message: err.customMessage || err.message,
        };
    }
});

app.use(bodyparser());
app.use(koaJwt({ secret: JWT_SECRET })
    .unless({ path: [`${ENDPOINT_PREFIX}/public`, `${ENDPOINT_PREFIX}/ping`, `${ENDPOINT_PREFIX}/getjwt`, `${ENDPOINT_PREFIX}/login`, `${ENDPOINT_PREFIX}/raw-export`] }));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
