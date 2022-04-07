var admin = require("firebase-admin");

var serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://ecommerce-e54f2-default-rtdb.asia-southeast1.firebasedatabase.app",
});

module.exports = admin;
