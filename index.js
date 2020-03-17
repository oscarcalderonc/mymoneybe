
const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');
const logger = require('koa-logger');

const app = new Koa();

const prefix = process.env.SERVER_PROXY_PATH ? process.env.SERVER_PROXY_PATH : '';
const router = new Router({ prefix });

router.get('/ping', (ctx, next) => {
  ctx.body = `Hello fucking world at  ${new Date()}`;
  next();
});

router.get('/', (ctx, next) => {
  ctx.body = 'Hello world';
  next();
});

app.use(router.routes())
  .use(router.allowedMethods());

app.use(logger());

app.use(cors({
  origin(ctx) {
    return '*';
  },
}));

const server = app.listen(process.env.SERVER_HTTP_PORT, () => {
  console.log(`Server started in port ${process.env.SERVER_HTTP_PORT}`);
});

module.exports = server;
