import StartWebServer from "./api";
import BTCWatcher from "./BTCWatcher";
import c from "./api/components/payment/controller";
console.log("STARTING UP");
const i = BTCWatcher.GetInstance();
i.connect().then((connected) => {
	console.log("CONNECTION WITH BLOCKCHAIN!");
	StartWebServer();
});
