const Router = require('@koa/router');

const prefix = process.env.SERVER_PROXY_PATH || '';
const router = new Router({ prefix });
const setPublicRoutes = require('./publicRoutes');
const setPrivateRoutes = require('./privateRoutes');
const setAccountsRoutes = require('./accounts');
const setAccountTypesRoutes = require('./accountTypes');
const setCategoriesRoutes = require('./categories');
const setWorkspacesRoutes = require('./workspaces');
const setTransactionTypesRoutes = require('./transactionTypes');
const setBanksRoutes = require('./banks');
const setTransactionRoutes = require('./transactions');

setPublicRoutes(router);
setPrivateRoutes(router);
setAccountsRoutes(router);
setAccountTypesRoutes(router);
setCategoriesRoutes(router);
setTransactionTypesRoutes(router);
setTransactionRoutes(router);
setWorkspacesRoutes(router);
setBanksRoutes(router);

module.exports = router;
