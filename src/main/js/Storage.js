const axios = require('axios').default;
import {v4 as uuidv4 } from 'uuid';
const queryString = require('query-string');

class StorageClient {
	constructor(){}

	saveThought(newThought){}

	updateThought(updatedThought){}

	getThought(thoughtId){}

	getThoughtToReview(){}

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
		var startTime = new Date().getTime();
		var backendClient = this;
		return new Promise(function(resolve, reject) {
			axios({
			  method: 'get',
			  url: '/v2/get?id='+thoughtId,
			  headers: {'Cache-Control': 'max-stale=5s'}
			})
			.then(function(response) {
				var endTime = new Date().getTime();
				console.log(endTime-startTime);
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
		var startTime = new Date().getTime();
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
				var endTime = new Date().getTime();
				var extraDelay = 0;
				if (endTime-startTime < 1000) {
					extraDelay = 1000 - (endTime-startTime);
				}

				setTimeout(() => {
					if (response.status === 200) {
						if (response.data.error != "") {
							reject(response.data.error);
						} else {
							resolve(response.data);
						}
					} else {
						reject("Encountered error while saving thought in database :(. Try again later?");
					}
				}, extraDelay);

			}).catch(function(err) {
				console.log(err);
				reject("Encountered error while saving thought in database :(. Try again later?");
			});
		});			
	}

	getThoughtToReview = (reviewedThoughtId) => {
		var backendClient = this;

		console.log(reviewedThoughtId);
		return new Promise(function(resolve, reject) {
			axios({
			  method: 'post',
			  url: '/v2/review?reviewedThoughtId='+reviewedThoughtId
			}).then(function(response) {
				if (response.status === 200) {
					if (response.data.error != "") {
						reject(response.data.error);
					} else {
						resolve(response.data);
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

var backendStorageClient = new BackendStorageClient();

export const saveThought = backendStorageClient.saveThought;
export const getThought = backendStorageClient.getThought;
export const deleteThought = backendStorageClient.deleteThought;
export const getThoughtToReview = backendStorageClient.getThoughtToReview;
export const updateThought = backendStorageClient.updateThought;
export const searchThoughts= backendStorageClient.searchThoughts;