import WebSocket from "ws";
const btcEndpoint = "wss://ws.blockchain.info/inv";

class BTCWatcher {
	private static instance: BTCWatcher;

	public listeningList = {};
	public socket: WebSocket;

	private constructor() {}

	public connect() {
		this.socket = new WebSocket(btcEndpoint);
		this.socket.onmessage = this.handleMessage;
		return new Promise((resolve, reject) => {
			while (!this.socket.OPEN) {}
			resolve(true);
		});
	}

	private handleMessage(msg) {
		var response = JSON.parse(msg.data);
		var getOuts = response.x.out;
		getOuts.map(function (out, i) {
			if (out.addr in this.listeningList) {
				var amount = out.value;
				var calAmount = amount / 100000000;
				console.log(calAmount + " BTC"); // <-- The total amount just received
				this.listeningList[out.addr](amount);
			}
		});
	}

	public StopListenAddress(address: string) {
		if (address in this.listeningList) {
			this.socket.send(
				JSON.stringify({ op: "addr_unsub", addr: address })
			);
			delete this.listeningList[address];
		}
	}

	public ListenAddress(address: string, callback?: CallableFunction) {
		if (address in this.listeningList) {
		} else {
			this.socket.send(JSON.stringify({ op: "addr_sub", addr: address }));
			this.listeningList[address] = callback || (() => {});
		}
	}

	public static GetInstance() {
		if (!BTCWatcher.instance) {
			BTCWatcher.instance = new BTCWatcher();
		}

		return BTCWatcher.instance;
	}
}

export default BTCWatcher;
