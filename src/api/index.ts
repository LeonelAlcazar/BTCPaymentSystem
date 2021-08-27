import express from "express";
import cors from "cors";
import config from "../config";
import SocketIOListen from "../Server";
import http from "http";
import errors from "../network/errors";
import path from "path";

import paymentNetwork from "./components/payment/network";

export default function StartWebServer() {
	const app = express();
	const server = http.createServer(app);
	app.use(cors());
	const io = SocketIOListen(server);

	server.listen(config.API.port, () => {
		console.log("SERVER LISTENING IN http://localhost:" + config.API.port);
	});

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use((req: any, res, next) => {
		req.io = io;
		next();
	});

	// Routes

	app.use("/payments", paymentNetwork);
	app.use(
		"/",
		express.static(
			path.join(path.dirname(require.main.filename), "..", "public")
		)
	);
	/*app.use("/", (req, res, next) => {
		const page = path.join(
			path.dirname(require.main.filename),
			"..",
			"public",
			"index.html"
		);
		res.sendFile(page);
	});*/

	app.use(errors);
}
