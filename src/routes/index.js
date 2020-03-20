const Router = require('@koa/router');

const prefix = process.env.SERVER_PROXY_PATH ? process.env.SERVER_PROXY_PATH : '';
const router = new Router({ prefix });
const setPublicRoutes = require('./publicRoutes');
const setPrivateRoutes = require('./privateRoutes');

setPublicRoutes(router);
setPrivateRoutes(router);

module.exports = router;
