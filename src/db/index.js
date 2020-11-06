const admin = require('firebase-admin');

const { SERVICE_ACCOUNT = '{}', IS_GCP } = process.env;

const connectionConfig = {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || "show-me-my-money-db"
};

if (IS_GCP === 'true') {
    connectionConfig.credential = admin.credential.cert(JSON.parse(SERVICE_ACCOUNT));
}

admin.initializeApp(connectionConfig);

module.exports = admin.firestore();
