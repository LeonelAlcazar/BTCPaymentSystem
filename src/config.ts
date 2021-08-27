import dotenv from "dotenv";
import * as admin from "firebase-admin";
dotenv.config();

const config = {
	API: {
		port: process.env.PORT || 8080,
	},
	FIREBASE: {
		apiKey: process.env.FIREBASE_APIKEY || "",
		projectId: process.env.FIREBASE_PROJECTID || "",
		appId: process.env.FIREBASE_APPID || "",
		credential: admin.credential.cert(
			process.env.FIREBASE_CREDENTIAL_ABSOLUTEPATH || ""
		),
	},
};

export default config;
