const axios = require('axios').default;
import {v4 as uuidv4 } from 'uuid';
const queryString = require('query-string');

class StorageClient {
	constructor(){}

	saveThought(newThought){}

	updateThought(updatedThought){}

	getThought(thoughtId){}

	getThoughtsToReview(){}

	finishReviewingThoughts(){}

	searchThoughts(query){}
}

class BackendStorageClient extends StorageClient{

	convertEntityToThought = (entity) => {
		console.log(entity);
		const thought = {
			id: null,
			title: null,
			content: null,
			creationTimestampMs: null,
			tags: new Map(),
			replies: new Map(),
			plusOnes: 1,
			completed: false,
			lastEditedTimestampMs: null,
			lastReviewedTimestampMs: null,
			deleted: false,
		};

		thought.id = entity.id;
		thought.title = entity.title;
		thought.content = entity.content;
		thought.creationTimestampMs = entity.creation_timestamp_ms;

		for (var i = 0; i < entity.tags.length; i++) {
			thought.tags.set(entity.tags[i].tag_key, entity.tags[i].tag_content);
		}

		for (var i = 0; i < entity.replies.length; i++) {
			thought.replies.set(entity.replies[i].reply_timestamp_ms, entity.replies[i].reply_content);
		}

		thought.plusOnes = entity.plusOnes;
		thought.completed = entity.completed;
		thought.lastReviewedTimestampMs = entity.last_reviewed_timestamp_ms;
		thought.lastEditedTimestampMs = entity.last_edited_timestamp_ms;

		return thought;
	}

	convertThoughtToEntity = (thought) => {
		console.log(thought);
		
		const entity = {
			tags: [],
			replies: []
		};

		if (thought.id != null) {
			entity.id = thought.id;
			entity.creation_timestamp_ms = thought.creationTimestampMs;
			entity.last_reviewed_timestamp_ms = thought.lastReviewedTimestampMs;
		}

		entity.title = thought.title;
		entity.content = thought.content;

		for (let [key, value] of thought.tags) {
			entity.tags.push({"tag_key": key, "tag_content": value})
		}

		for (let [key, value] of thought.replies) {
			entity.replies.push({"reply_timestamp_ms": key, "reply_content":value})
		}

		entity.plusOnes = thought.plusOnes;
		entity.completed = thought.completed;

		console.log(entity);	
		return entity;
	}

	getThought = (thoughtId) => {
		var backendClient = this;
		return new Promise(function(resolve, reject) {
			axios({
			  method: 'get',
			  url: '/v2/get?id='+thoughtId,
			  headers: {'Cache-Control': 'max-stale=5s'}
			})
			.then(function(response) {
				if (response.status === 200) {
					if (response.data.error != "") {
						reject(response.data.error);
					} else {
						try {
							const thought = backendClient.convertEntityToThought(response.data.thought);
							resolve(thought);
						} catch (err) {
							console.log(err);
							reject("Encountered error while getting thought from database :{. Try agian later?");
						}
					}
				} else {
					reject("Encountered error while getting thought from database :(. Try again later?");
				}
			},
				function(err) {
					console.log(err);
					reject("Encountered error while getting thought from database :(. Try again later?");
				});
		});
	}

	deleteThought = (thoughtId) => {
		var backendClient = this;
		return new Promise(function(resolve, reject) {
			axios({
			  method: 'delete',
			  url: '/v2/delete?id='+thoughtId
			})
			.then(function(response) {
				if (response.status === 200) {
					if (response.data.error != "") {
						reject(response.data.error);
					} else {
						resolve();
					}
				} else {
					reject("Encountered error while deleting thought from database :(. Try again later?");
				}
			},
				function(err) {
					console.log(err);
					reject("Encountered error while deleting thought from database :(. Try again later?");
				});
		});
	}


	saveThought = (newThought) => {
		var backendClient = this;

		return new Promise(function(resolve, reject) {
			if (newThought == null) {
				reject(Error("Cannot save empty thought"));
				return;
			}

			const entity = backendClient.convertThoughtToEntity(newThought);

			axios({
			  method: 'post',
			  url: '/v2/save',
			  data: entity
			}).then(function(response) {
				if (response.status === 200) {
					if (response.data.error != "") {
						reject(response.data.error);
					} else {
						resolve(response.data);
					}
				} else {
					reject("Encountered error while saving thought in database :(. Try again later?");
				}
			}).catch(function(err) {
				console.log(err);
				reject("Encountered error while saving thought in database :(. Try again later?");
			});
		});			
	}

	getThoughtsToReview = () => {
		var backendClient = this;

		return new Promise(function(resolve, reject) {
			axios({
			  method: 'get',
			  url: '/v2/review'
			}).then(function(response) {
				if (response.status === 200) {
					if (response.data.error != "") {
						reject(response.data.error);
					} else {
						console.log(response.data);
						resolve(response.data.thoughtsInReview);
					}
				} else {
					reject("Encountered error while getting thoughts to review :(. Try again later?");
				}
			}).catch(function(err) {
				console.log(err);
				reject("Encountered error while getting thoughts to review :(. Try again later?");
			});
		});	
	}

	finishReviewingThoughts = () => {
		var backendClient = this;

		return new Promise(function(resolve, reject) {
			axios({
			  method: 'post',
			  url: '/v2/finishReview'
			}).then(function(response) {
				if (response.status === 200) {
					if (response.data.error != "") {
						reject(response.data.error);
					} else {
						resolve();
					}
				} else {
					reject("Encountered error while finishing review :(");
				}
			}).catch(function(err) {
				console.log(err);
				reject("Encountered error while finishing review :(");
			});
		});		
	}

	updateThought = (updatedThought) => {
		var backendClient = this;

		return new Promise(function(resolve, reject) {
			if (backendClient == null) {
				reject(Error("Cannot update empty thought"));
				return;
			}

			const entity = backendClient.convertThoughtToEntity(updatedThought);

			axios({
			  method: 'put',
			  url: '/v2/update',
			  data: entity
			}).then(function(response) {
				console.log(response);
				if (response.status === 200) {
					if (response.data.error != "") {
						reject(response.data.error);
					} else {
						resolve(response.data.currentTime);
					}
				} else {
					reject("Encountered error while updating thought in database :(. Try again later?");
				}
			}).catch(function(err) {
				console.log(err);
				reject("Encountered error while updating thought in database :(. Try again later?");
			});
		});			
	}

	searchThoughts = (searchCriteria) => {
		var backendClient = this;

		var query = {}

		searchCriteria.forEach((criteria, criteriaKey, map) => {
			if (criteria.type === "regular") {
				if (!("regular" in query)) {
					query["regular"] = [];
				}
				query["regular"].push(criteria.value);
			} else if (criteria.type === "tag") {
				if (!("tag" in query)) {
					query["tag"] = [];
				}
				query["tag"].push(criteria.value);
			}
		});

		query = queryString.stringify(query);

		return new Promise(function(resolve, reject) {
			axios({
			  method: 'get',
			  url: '/v2/search?'+query
			})
			.then(function(response) {
				console.log(response);
				if (response.status === 200) {
					if (response.data.error != "") {
						reject(response.data.error);
					} else {
						resolve(response.data.thoughts);
					}
				} else {
					reject("Encountered error while getting thoughts from database :(. Try again later?");
				}
			},
				function(err) {
					console.log(err);
					reject("Encountered error while getting thoughts from database :(. Try again later?");
				});
		});
	}
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
					var thoughtTags = null;

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

class BothStorageClient {
	constructor(){
		this.sessionStorageClient = new SessionStorageClient();
		this.backendStorageClient = new BackendStorageClient();
	}

	// getThoughtsToReview(){

	// }	

	// finishReviewingThoughts(){

	// }
}

var backendStorageClient = new BackendStorageClient();
var storageClient = new SessionStorageClient();
var bothStorageClient = new BothStorageClient();

export const saveThought = backendStorageClient.saveThought;
export const getThought = backendStorageClient.getThought;
export const deleteThought = backendStorageClient.deleteThought;
export const getThoughtsToReview = backendStorageClient.getThoughtsToReview;
export const finishReviewingThoughts = backendStorageClient.finishReviewingThoughts;
export const updateThought = backendStorageClient.updateThought;
export const searchThoughts= backendStorageClient.searchThoughts;