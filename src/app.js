const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const koaJwt = require('koa-jwt');
const router = require('./routes');

const ENDPOINT_PREFIX = process.env.SERVER_PROXY_PATH || '';
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'do_the_delicious_to_her';

const app = new Koa();

app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            console.log(err.message);
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    });
});

app.use(logger());
app.use(bodyparser());
app.use(koaJwt({ secret: JWT_SECRET })
    .unless({ path: [`${ENDPOINT_PREFIX}/public`, `${ENDPOINT_PREFIX}/ping`, `${ENDPOINT_PREFIX}/getjwt`, `${ENDPOINT_PREFIX}/login`] }));

app.use(cors({
    // eslint-disable-next-line no-unused-vars
    origin(ctx) {
        return 'https://oscarcalderon.com/';
    },
}));

app.use(router.routes())
    .use(router.allowedMethods());

module.exports = app;
