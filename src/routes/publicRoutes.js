const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');

const { JWT_SECRET = 'do_the_delicious_to_her', JWT_EXPIRE_IN = 60 * 60 * 24 * 14 } = process.env;

module.exports = (router) => {
  router.get('/ping', (ctx, next) => {
    ctx.body = `Hello fucking world at  ${new Date()}`;
    next();
  });

  router.post('/login', async (ctx, next) => {
    const { username, psswrd } = ctx.request.body;
    if (!username || username.trim() === '' || !psswrd || psswrd.trim() === '') {
      throw new Error('Missing/empty username/password');
    }

    // const res = await pool.query('SELECT * FROM usr WHERE username = $1', [username]);
    // const userData = res.rows[0];
    const oscar = 'oscar';
    const prueba123 = '$2b$10$PAndq8XJEJaQXiwiWb50ku9UZ8t4DnFujDXlgGpHV9WdgMUv6pzm6';
    const passwordMatch = await bcrypt.compare(psswrd, prueba123);

    if(username === oscar && passwordMatch) {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        // eslint-disable-next-line radix
        data: { ...ctx.request.body, exp: Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRE_IN) },
      }, JWT_SECRET);

      ctx.body = { token };
    } else {
      throw new Error('Invalid username & password');
    }

    next();
  });

  router.post('/getjwt', (ctx, next) => {
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      // eslint-disable-next-line radix
      data: { ...ctx.request.body, exp: Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRE_IN) },
    }, JWT_SECRET);
    ctx.body = { token };
    next();
  });
};
