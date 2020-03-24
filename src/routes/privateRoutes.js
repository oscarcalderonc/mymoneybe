module.exports = (router) => {
  router.get('/secreto', (ctx, next) => {
    ctx.body = 'Ahora tienes acceso al delicioso';
    next();
  });
};
