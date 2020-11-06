const admin = require('firebase-admin');

const connectionConfig = {
    credential: admin.credential.applicationDefault(),
    projectId: process.env.GOOGLE_CLOUD_PROJECT || "show-me-my-money-db"
};

admin.initializeApp(connectionConfig);

module.exports = admin.firestore();
