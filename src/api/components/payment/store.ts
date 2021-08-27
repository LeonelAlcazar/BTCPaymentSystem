import { v4 as uuidv4 } from "uuid";
import BTCWatcher from "../../../BTCWatcher";
import Wallet from "../wallet/store";
import store from "../../../store/firebase";

const COLLECTION = "payments";

class Payment {
	id: string;
	amount: number;
	paid: boolean;
	paidAmount: number;
	walletAddress: string;

	constructor(payment?: {
		id?: string;
		amount: number;
		paid?: boolean;
		paidAmount?: number;

		walletAddress: string;
	}) {
		if (payment) {
			this.id = payment.id || uuidv4();
			this.amount = payment.amount || 0;
			this.paid = payment.paid || false;
			this.paidAmount = payment.paidAmount || 0;
			this.walletAddress = payment.walletAddress || "";
		}
	}

	static async List() {
		return store.list(COLLECTION).then((payments: any[]) => {
			return payments.map((payment) => new Payment(payment));
		});
	}

	static async Find(query) {
		return store
			.query(COLLECTION, store.generateQuery(query))
			.then((payments: any[]) => {
				return payments.map((payment) => new Payment(payment));
			});
	}

	Save() {
		return store
			.upsert(COLLECTION, this)
			.then((payment) => new Payment(payment));
	}

	static async Get(query) {
		if (query) {
			if (query.uid) {
				return store
					.get(COLLECTION, query.uid)
					.then((payment) => new Payment(payment));
			}
			return store
				.query(COLLECTION, store.generateQuery(query))
				.then((payments: any[]) => {
					if (payments.length == 0) {
						return new Payment();
					}
					return new Payment(payments[0]);
				});
		}
		throw "Error";
	}

	Delete() {
		return store.deleteDoc(COLLECTION, this.id);
	}
}

export default Payment;
