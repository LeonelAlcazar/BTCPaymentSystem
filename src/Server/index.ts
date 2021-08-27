import * as socketio from "socket.io";
import config from "../config";

function listen(app) {
	var io = new socketio.Server(app, {
		cors: {
			origin: "*",
		},
	});
	io.on("connection", (socket) => {
		socket.on("payment-sub", (data) => {
			socket.join("payment-" + data.id);
		});
		socket.on("payment-unsub", (data) => {
			socket.leave("payment-" + data.id);
		});
	});

	return io;
}

export default listen;
