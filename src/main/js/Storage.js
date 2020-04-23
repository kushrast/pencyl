import {v4 as uuidv4 } from 'uuid';

class StorageClient {
	constructor(){}

	saveThought(){}
}

class SessionStorageClient extends StorageClient {
	constructor() {
		super();
		if (typeof(Storage) == "undefined") {
			console.log("Cannot store to local storage");
			this.localStorageSupported = false;
		} else {
			this.localStorageSupported = true;
		}
	}

	saveThought = (newThought) => {
		var localStorageSupported = this.localStorageSupported;
		return new Promise(function(resolve, reject) {
			if (newThought == null) {
				reject(Error("Cannot save empty thought"));
			}

			if (localStorageSupported) {
				var thoughtsDictionary = {}
				if (localStorage.getItem("thoughts") !== null) {
					thoughtsDictionary = JSON.parse(localStorage.getItem("thoughts"));
				}

				var id;

				if (!(id in newThought)) {
					id  = uuidv4();
					newThought.id = id;
				} else {
					id = newThought.id;
				}

				thoughtsDictionary[id] = newThought;

				localStorage.thoughts = JSON.stringify(thoughtsDictionary);

				setTimeout(() => {resolve("Success");}, 1000);
				
			} else {
				reject(Error("Browser does not support local storage."));
			}
		});
	}
}

var storageClient = new SessionStorageClient();

export const saveThought = storageClient.saveThought;