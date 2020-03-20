module.exports = (router) => {
  router.get('/secreto', (ctx, next) => {
    ctx.body = 'Secreto';
    next();
  });
};
