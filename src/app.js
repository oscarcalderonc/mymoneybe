const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const jsonwebtoken = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const router = require('./routes');

const prefix = process.env.SERVER_PROXY_PATH ? process.env.SERVER_PROXY_PATH : '';
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'carenalga';

const app = new Koa();

app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      console.log(err.message);
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

app.use(logger());
app.use(koaBody());
app.use(koaJwt({ secret: JWT_SECRET })
  .unless({ path: [`${prefix}/public`, `${prefix}/ping`, `${prefix}/getjwt`] }));

app.use(cors({
  // eslint-disable-next-line no-unused-vars
  origin(ctx) {
    return 'https://oscarcalderon.com/';
  },
}));

app.use(router.routes())
  .use(router.allowedMethods());

module.exports = app;
