const { isEmpty } = require('lodash');
const db = require('../db');

module.exports = (router) => {
    router.get('/accounts', async (ctx, next) => {
        const accounts = await db.collection('accounts').get();
        ctx.body = accounts.docs;
        next();
    });

    // router.get('/getHash', async (ctx, next) => {
    //     ctx.body = await bcrypt.hash(ctx.request.body.word, 10);
    //     next();
    // });

    // router.post('/login', async (ctx, next) => {
    //     const { username, psswrd: password } = ctx.request.body;

    //     if (isEmpty(username) || isEmpty(password)) {
    //         throw new Error('Missing/empty username/password');
    //     }

    //     const matches = await db.collection('users').where('username', '==', username).get();

    //     if (matches.empty) {
    //         throw new Error('Invalid username & password');
    //     }
    //     let userMatch;
    //     matches.forEach((doc) => {
    //         userMatch = doc.data();
    //         userMatch.id = doc.id;
    //     });

    //     const passwordMatch = await bcrypt.compare(password, userMatch.pwd_hash);

    //     if (passwordMatch) {
    //         const token = jwt.sign({
    //             // eslint-disable-next-line radix
    //             exp: Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRE_IN),
    //             sub: userMatch.id,
    //             data: { usr: username },
    //         }, JWT_SECRET);

    //         ctx.body = { token };
    //     } else {
    //         throw new Error('Invalid username & password');
    //     }

    //     next();
    // });
};
