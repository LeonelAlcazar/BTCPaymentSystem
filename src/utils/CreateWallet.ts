const bip32 = require("bip32");
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");

const network = bitcoin.networks.bitcoin;

const path = `m/44'/0'/0'/0`;

export default function CreateWallet() {
	let mnemonic = bip39.generateMnemonic();
	const seed = bip39.mnemonicToSeedSync(mnemonic);
	let root = bip32.fromSeed(seed, network);

	let account = root.derivePath(path);
	let node = account.derive(0).derive(0);

	let btcAddress = bitcoin.payments.p2pkh({
		pubkey: node.publicKey,
		network: network,
	}).address;

	return {
		address: btcAddress,
		key: node.toWIF(),
		node: node,
		mnemonic: mnemonic,
	};
}
