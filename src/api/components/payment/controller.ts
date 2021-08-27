import BTCWatcher from "../../../BTCWatcher";
import Wallet from "../wallet/store";
import Payment from "./store";

function RequestPayment(data) {
	return new Promise(async (resolve, reject) => {
		const wallet = new Wallet();
		await wallet.Save();
		let payment = new Payment({
			amount: data.amount,
			walletAddress: wallet.address,
		});

		const instance = BTCWatcher.GetInstance();
		instance.ListenAddress(wallet.address, async (amount) => {
			payment.paidAmount += amount;
			if (payment.amount <= payment.paidAmount) {
				payment.paid = true;
				instance.StopListenAddress(wallet.address);
			} else {
			}
			await payment.Save();
		});
		resolve({ payment, wallet });
	});
}

export default { RequestPayment };
