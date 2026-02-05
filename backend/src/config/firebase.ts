import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const serviceAccountPath = path.resolve(
    process.cwd(),
    "serviceAccountKey.json"
);

const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    console.log(" Firebase Admin Initialized");
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
