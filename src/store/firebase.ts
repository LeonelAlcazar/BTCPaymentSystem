import * as admin from "firebase-admin";
import config from "../config";

const App = admin.initializeApp(config.FIREBASE);
export const firestore = App.firestore();
export const Timestamp = typeof admin.firestore.Timestamp;
export function convertDateToTimestamp(date: Date) {
	return admin.firestore.Timestamp.fromDate(date);
}

firestore.settings({ ignoreUndefinedProperties: true });

function generateQuery(query) {
	let finalQuery = {};
	Object.keys(query).forEach((key) => {
		finalQuery[key] = { comparation: "==", value: query[key] };
	});
	return finalQuery;
}

async function list(collection) {
	try {
		const documents = await firestore.collection(`${collection}/`).get();
		return documents.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		});
	} catch (error) {
		throw error;
	}
}

async function get(collection, id): Promise<any> {
	try {
		const document = await firestore.doc(`${collection}/${id}`).get();
		return {
			id,
			...document.data(),
		};
	} catch (error) {
		throw error;
	}
}

async function deleteDoc(collection, id) {
	try {
		return firestore.doc(`${collection}/${id}`).delete();
	} catch (error) {
		throw error;
	}
}

async function insert(documentRef, data) {
	try {
		const finalData = {
			...data,
			registerDate: admin.firestore.Timestamp.fromDate(new Date()),
		};
		await documentRef.set(finalData);
		return { id: documentRef.id, ...finalData };
	} catch (error) {
		throw error;
	}
}

async function update(documentRef, snapshot, data) {
	try {
		const finalData = { ...snapshot.data(), ...data };
		//console.log(finalData);
		await documentRef.set(finalData);
		return { id: documentRef.id, ...finalData };
	} catch (error) {
		throw error;
	}
}

async function upsert(collection, data) {
	const id = data.id;
	delete data["id"];
	const documentRef = firestore.doc(`${collection}/${id}`);
	const snapshot = await documentRef.get();

	//googleStore.setRegistro(snapshot, documentRef, data);

	if (snapshot.exists) {
		return await update(documentRef, snapshot, data);
	} else {
		return await insert(documentRef, data);
	}
}

async function query(collection, query) {
	return new Promise(async (resolve, reject) => {
		const collectionRef = firestore.collection(collection);

		var queryRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

		Object.keys(query).forEach((e) => {
			if (queryRef === null || queryRef === undefined) {
				queryRef = collectionRef.where(
					e,
					query[e].comparation,
					query[e].value
				);
			} else {
				queryRef = queryRef.where(
					e,
					query[e].comparation,
					query[e].value
				);
			}
		});
		try {
			const documents = await queryRef.get();

			const response = documents.docs.map((doc) => {
				return { id: doc.id, ...doc.data() };
			});
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function CountWithQuery(collection: string, query) {
	return new Promise(async (resolve, reject) => {
		const collectionRef = firestore.collection(collection);

		var queryRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

		Object.keys(query).forEach((e) => {
			if (queryRef === null || queryRef === undefined) {
				queryRef = collectionRef.where(
					e,
					query[e].comparation,
					query[e].value
				);
			} else {
				queryRef = queryRef.where(
					e,
					query[e].comparation,
					query[e].value
				);
			}
		});
		try {
			const documents = await queryRef.get();
			resolve(documents.size);
		} catch (error) {
			reject(error);
		}
	});
}

export default {
	list,
	get,
	upsert,
	query,
	generateQuery,
	deleteDoc,
	CountWithQuery,
};
