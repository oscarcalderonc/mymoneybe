const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isEmpty } = require('lodash');
const db = require('../db');

const { JWT_SECRET = 'do_the_delicious_to_her', JWT_EXPIRE_IN = 60 * 60 * 24 * 14 } = process.env;

module.exports = (router) => {
    router.get('/ping', (ctx, next) => {
        ctx.body = `Hello fucking world at ${new Date()}`;
        next();
    });

    router.get('/getHash', async (ctx, next) => {
        ctx.body = await bcrypt.hash(ctx.request.body.word, 10);
        next();
    });

    router.post('/login', async (ctx, next) => {
        const { username, psswrd: password } = ctx.request.body;

        if (isEmpty(username) || isEmpty(password)) {
            throw new Error('Missing/empty username/password');
        }

        const matches = await db.collection('users').where('username', '==', username).get();

        let userMatch;
        matches.forEach((doc) => {
            userMatch = doc.data();
            userMatch.id = doc.id;
        });

        const passwordMatch = await bcrypt.compare(password, userMatch.pwd_hash);

        if (passwordMatch) {
            const token = jwt.sign({
                // eslint-disable-next-line radix
                exp: Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRE_IN),
                sub: userMatch.id,
                data: { usr: username },
            }, JWT_SECRET);

            ctx.body = { token };
        } else {
            throw new Error('Invalid username & password');
        }

        next();
    });
};
