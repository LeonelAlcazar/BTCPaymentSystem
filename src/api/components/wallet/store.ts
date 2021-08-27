import { v4 as uuidv4 } from "uuid";
import CreateWallet from "../../../utils/CreateWallet";
import store from "../../../store/firebase";

const COLLECTION = "wallets";

class Wallet {
	id: string;
	address: string;
	mnemonic: string;
	key: string;

	constructor(wallet?: {
		id?: string;
		address?: string;
		mnemonic?: string;
		key?: string;
	}) {
		this.id = wallet?.id || uuidv4();
		console.log(this.id);
		if (
			wallet?.address !== "" &&
			wallet?.address !== undefined &&
			wallet?.mnemonic !== "" &&
			wallet?.mnemonic !== undefined &&
			wallet?.key !== "" &&
			wallet?.key !== undefined
		) {
			this.address = wallet?.address;
			this.mnemonic = wallet?.mnemonic;
			this.key = wallet?.key;
		} else {
			const new_wallet = CreateWallet();
			this.address = new_wallet.address;
			this.mnemonic = new_wallet.mnemonic;
			this.key = new_wallet.key;
		}
	}

	static async List() {
		return store.list(COLLECTION).then((wallets: any[]) => {
			return wallets.map((wallet) => new Wallet(wallet));
		});
	}

	static async Find(query) {
		return store
			.query(COLLECTION, store.generateQuery(query))
			.then((wallets: any[]) => {
				return wallets.map((wallet) => new Wallet(wallet));
			});
	}

	Save() {
		return store
			.upsert(COLLECTION, this)
			.then((wallet) => new Wallet(wallet));
	}

	static async Get(query) {
		if (query) {
			if (query.uid) {
				return store
					.get(COLLECTION, query.uid)
					.then((wallet) => new Wallet(wallet));
			}
			return store
				.query(COLLECTION, store.generateQuery(query))
				.then((wallets: any[]) => {
					if (wallets.length == 0) {
						return new Wallet();
					}
					return new Wallet(wallets[0]);
				});
		}
		throw "Error";
	}

	Delete() {
		return store.deleteDoc(COLLECTION, this.id);
	}
}

export default Wallet;
