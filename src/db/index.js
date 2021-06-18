// const admin = require('firebase-admin');

// const { SERVICE_ACCOUNT = '{}', IS_GCP } = process.env;

// const connectionConfig = {
//     projectId: process.env.GOOGLE_CLOUD_PROJECT || "show-me-my-money-db"
// };

// if (IS_GCP === 'true') {
//     connectionConfig.credential = admin.credential.cert(JSON.parse(SERVICE_ACCOUNT));
// }

// admin.initializeApp(connectionConfig);

// module.exports = admin.firestore();

const Knex = require('knex');

const knex = Knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        searchPath: ['public'],
    },
    pool: { min: 4, max: 8 },
});

module.exports = knex;
