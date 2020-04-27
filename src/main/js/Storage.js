import {v4 as uuidv4 } from 'uuid';

class StorageClient {
	constructor(){}

	saveThought(newThought){}

	updateThought(updatedThought){}

	getThought(thoughtId){}

	getThoughtsToReview(){}

	finishReviewingThoughts(){}

	searchThoughts(query){}
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
				return;
			}

			if (localStorageSupported) {
				var thoughtsDictionary = {}
				if (localStorage.getItem("thoughts") !== null) {
					thoughtsDictionary = JSON.parse(localStorage.getItem("thoughts"));
				}

				newThought.replies = Array.from(newThought.replies);
				newThought.tags = Array.from(newThought.tags);
				newThought.creationTimestampMs = new Date().getTime();
				newThought.lastEditedTimestampMs = newThought.creationTimestampMs

				var id;

				if (!(id in newThought)) {
					id  = uuidv4();
					newThought.id = id;
				} else {
					id = newThought.id;
				}

				thoughtsDictionary[id] = newThought;

				console.log(newThought);
				localStorage.thoughts = JSON.stringify(thoughtsDictionary);

				setTimeout(() => {resolve({showSuggestReviewScreen: true});}, 1000);
				return;
				
			} else {
				reject(Error("Browser does not support local storage."));
				return;
			}
		});
	}

	getThought = (thoughtId) => {
		var localStorageSupported = this.localStorageSupported;

		return new Promise(function(resolve, reject) {

			if (!localStorageSupported) {
				reject(Error("Cannot pull thought in review. Browser does not support local storage. "));
				return;
			}

			if (localStorage.getItem("thoughts") !== null) {
				var thoughtsDictionary = JSON.parse(localStorage.getItem("thoughts"));

				if (thoughtId in thoughtsDictionary) {
					var thought = thoughtsDictionary[thoughtId];

					thought.tags = new Map(thought.tags);
					thought.replies = new Map(thought.replies);
					resolve(thought);
				} else {
					reject(Error("Invalid thought. Could not find."));
				}
			} else {
				reject(Error("Invalid thought. Could not find"));
			}
		});
	}

	getThoughtsToReview = () => {
		var localStorageSupported = this.localStorageSupported;

		return new Promise(function(resolve, reject) {

			if (!localStorageSupported) {
				reject(Error("Cannot pull thoughts in review. Browser does not support local storage. "));
				return;
			}

			var thoughtIdsToReview = [];
			var numNewThoughtsToFindForReview = 3;
			//TODO: Replace DB keys with static variables
			if (localStorage.getItem("thoughtsInReview") !== null) {
				thoughtIdsToReview = JSON.parse(localStorage.getItem("thoughtsInReview"));
				numNewThoughtsToFindForReview -= thoughtIdsToReview.length;

				if (numNewThoughtsToFindForReview == 0) {
					resolve(thoughtIdsToReview);
					return;
				}

			}

			if (localStorage.getItem("thoughts") !== null) {
				var thoughtsDictionary = JSON.parse(localStorage.getItem("thoughts"));

				var thoughtIds = Object.keys(thoughtsDictionary);

				if (thoughtIds.length <= 3) {
					thoughtIdsToReview = thoughtIds;
				} else {
					var i = 0;
					while (i < numNewThoughtsToFindForReview) {
						const randomThoughtKeyIndex = Math.floor(Math.random()*thoughtIds.length);
						if (!thoughtIdsToReview.includes(thoughtIds[randomThoughtKeyIndex])) {
							thoughtIdsToReview.push(thoughtIds[randomThoughtKeyIndex]);
							i += 1;
						}
					}
				}
			}
			localStorage.thoughtsInReview = JSON.stringify(thoughtIdsToReview);
			resolve(thoughtIdsToReview);
		});
	}

	finishReviewingThoughts = () => {
		var localStorageSupported = this.localStorageSupported;

		return new Promise(function(resolve, reject) {

			if (!localStorageSupported) {
				reject(Error("Cannot finish reviewing thoughts. Browser does not support local storage."));
				return;
			}

			var thoughtIdsToReview = [];
			var numNewThoughtsToFindForReview = 3;
			//TODO: Replace DB keys with static variables
			if (localStorage.getItem("thoughtsInReview") !== null) {
				localStorage.thoughtsInReview = JSON.stringify([]);
				resolve("Success");
			} else {
				reject(Error("No thoughts to finish reviewing."));
			}
		});
	}

	updateThought = (updatedThought) => {
		updatedThought = Object.assign({}, updatedThought);
		var localStorageSupported = this.localStorageSupported;

		return new Promise(function(resolve, reject) {
			if (!localStorageSupported) {
				reject(Error("Cannot update thought. Browser does not support local storage."));
				return;
			}

			if (localStorage.getItem("thoughts") !== null) {
				var thoughtsDictionary = JSON.parse(localStorage.getItem("thoughts"));

				if (updatedThought.id in thoughtsDictionary) {
					updatedThought.replies = Array.from(updatedThought.replies);
					updatedThought.tags = Array.from(updatedThought.tags);
					updatedThought.lastEditedTimestampMs = new Date().getTime();

					thoughtsDictionary[updatedThought.id] = updatedThought;

					localStorage.thoughts = JSON.stringify(thoughtsDictionary);

					setTimeout(
						() => {
							resolve(updatedThought.lastEditedTimestampMs);
						}, 1500);
				} else {
					reject(Error("Error while updating thought. Could not find original thought."));
				}
			} else {
				reject(Error("Error while updating thought. Could not find original thought."));
			}
		});
	}

	searchThoughts = (searchCriteria) => {
		var localStorageSupported = this.localStorageSupported;

		return new Promise(function(resolve, reject) {

			if (!localStorageSupported) {
				reject(Error("Cannot pull thoughts. Browser does not support local storage. "));
				return;
			}

			if (localStorage.getItem("thoughts") !== null) {
				var thoughtsDictionary = JSON.parse(localStorage.getItem("thoughts"));

				var thoughtIds = [];

				if (searchCriteria.size == 0) {
					resolve(Object.keys(thoughtsDictionary));
					return;
				}

				for (var key in thoughtsDictionary) {
					var include = false;

					searchCriteria.forEach((criteria, criteriaKey, map) => {
						if (criteria.type === "tag") {
							if (thoughtTags == null) {
								thoughtTags = new Map(thoughtsDictionary[key].tags);
							}

							thoughtTags.forEach((tag, tagKey, map) => {
								if (tag === criteria.value) {
									include = true;
								}
							});
						} else {
	
							if (thoughtsDictionary[key].title.includes(criteria.value) || thoughtsDictionary[key].content.includes(criteria.value)) {
								console.log(thoughtsDictionary[key]);
								include = true;
							} 
						}
					});

					if (include) {
						thoughtIds.push(key);
					}
				}

				resolve(thoughtIds);
			} else {
				resolve([]);
			}
		});
	}
}

var storageClient = new SessionStorageClient();

export const saveThought = storageClient.saveThought;
export const getThought = storageClient.getThought;
export const getThoughtsToReview = storageClient.getThoughtsToReview;
export const finishReviewingThoughts = storageClient.finishReviewingThoughts;
export const updateThought = storageClient.updateThought;
export const searchThoughts= storageClient.searchThoughts;