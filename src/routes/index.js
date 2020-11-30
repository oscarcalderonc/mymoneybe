const Router = require('@koa/router');

const prefix = process.env.SERVER_PROXY_PATH || '';
const router = new Router({ prefix });
const setPublicRoutes = require('./publicRoutes');
const setPrivateRoutes = require('./privateRoutes');
const setAccountsRoutes = require('./accounts');
const setAccountTypesRoutes = require('./accountTypes');

setPublicRoutes(router);
setPrivateRoutes(router);
setAccountsRoutes(router);
setAccountTypesRoutes(router);

module.exports = router;
