const admin = require("firebase-admin");

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    );
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  if (projectId) {
    return admin.initializeApp({ projectId });
  }

  throw new Error(
    "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID and service credentials.",
  );
}

module.exports = {
  admin,
  getFirebaseAdminApp,
};
