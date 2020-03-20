const jsonwebtoken = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'carenalga';

module.exports = (router) => {
  router.get('/ping', (ctx, next) => {
    ctx.body = `Hello fucking world at  ${new Date()}`;
    next();
  });

  router.get('/', (ctx, next) => {
    ctx.body = 'Hello world';
    next();
  });

  router.post('/getjwt', (ctx, next) => {
    const jwt = jsonwebtoken.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: JSON.stringify(ctx.request.body),
    }, JWT_SECRET);
    console.log(jwt);
    ctx.body = { jwt };
    next();
  });

  router.post('/ping', (ctx, next) => {
    console.log('The request is...');
    ctx.body = `Request Body: ${JSON.stringify(ctx.request.body)}`;
    next();
  });
};
