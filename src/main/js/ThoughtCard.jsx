import React, { Component } from 'react';
import CategoryComponent from './CategoryComponent.jsx';
import TextareaAutosize from 'react-autosize-textarea';
import DeleteModal from './DeleteModal.jsx';
import update from 'immutability-helper';
import Popover from 'react-tiny-popover'
import {saveThought, getThought, updateThought} from "./Storage.js";
import {quickFormat, prettyFormat, dateAwareFormat} from "./TimeFormatUtils.js";
import "animate.css";
import "./css/ThoughtCard.css";

class ThoughtCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentThought: {
				id: null,
				title: null,
				content: null,
				creationTimestampMs: null,
				tags: new Map(),
				category : 0,
				replies: new Map(),
				plusOnes: 1,
				completed: false,
				lastEditedTimestampMs: null,
				lastReviewedTimestampMs: null,
				deleted: false,
			},
			hasTitle: false,
			hasContent: false,
			hasTagContent: false,
			hasTypedInfo: false,
			hasReplyContent: false,
			currentlySaving: false,
			saveSuccess: false,
			showPopoverReplyId: "",
			showSuggestReviewScreen: false,
		}	
	}

	componentDidMount() {
		if (this.props.mode === "review") {
			this.loadThought();
		} else {
			this.setFocusToContent();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.mode === "review" && prevProps.thoughtId != this.props.thoughtId) {
			this.loadThought();
		}
	}

	loadThought = () => {
		const component = this;
		getThought(this.props.thoughtId).then(
			function(thought) {
				console.log(thought);
				component.setState({
					currentThought: thought,
					hasTitle: thought.title != "",
					hasContent: thought.content != "",
					hasTagContent: false,
					hasTypedInfo: true,
				});
				document.getElementById("thought-title-area").value = thought.title;
				document.getElementById("thought-content-area").value = thought.content;
			}, function(err) {
				console.log(err);
			}
		);
	}

	/* Triggered when the Title textarea is updated. Helps us determine whether to show the delete/update buttons */
	onTitleUpdate = (event) => {
		var title = event.target.value;

		if (title != "") {
			this.setState({
				hasTitle: true
			}, this.checkIfTitleOrContentPresent);
		} else {
			this.setState({
				hasTitle: false
			}, this.checkIfTitleOrContentPresent);
		}
	}

	/* Triggered when the Content textarea is updated. Helps us determine whether to show the delete/update buttons */
	onContentUpdate = (event) => {
		var content = event.target.value;

		if (content != "") {
			this.setState({
				hasContent: true
			}, this.checkIfTitleOrContentPresent);
		} else {
			this.setState({
				hasContent: false
			}, this.checkIfTitleOrContentPresent);
		}
	}


	/* Checks if a title or content are present. Updates state accordingly */
	checkIfTitleOrContentPresent = () => {
		if (this.state.hasContent || this.state.hasTitle) {
			this.setState({
				hasTypedInfo: true
			});
		} else {
			this.setState({
				hasTypedInfo: false
			});
		}
	}

	/* Triggered when tag input is updated. Helps determine if any text is present in the tag input */
	onTagUpdate = (event) => {
		var tagContent = event.target.value;

		if (tagContent == "") {
			this.setState({
				hasTagContent: false,
			});
		} else {
			this.setState({
				hasTagContent: true,
			});
		}
	}

	/* Triggered when reply input is updated. Helps determine if any text is present in the reply input */
	onReplyUpdate = (event) => {
		var replyContent = event.target.value;

		if (replyContent == "") {
			this.setState({
				hasReplyContent: false,
			});
		} else {
			this.setState({
				hasReplyContent: true,
			});
		}
	}

	/* Triggered on keyup from tag input. Submits tag if pressed key was a space */
	onTagKeyUp = (event) => {
		if (event.keyCode === 13) {
			this.saveTag();
		}
	}

	/* Triggered on keyup from tag input. Submits tag if pressed key was a space */
	onReplyKeyUp = (event) => {
		if (event.keyCode === 13) {
			this.saveReply();
		}
	}

	/* Hashes a string to an integer */
	stringHash(s) {
		for(var i = 0, h = 0; i < s.length; i++)
			h = Math.imul(31, h) + s.charCodeAt(i) | 0;

		return Math.abs(h)
	}

	/* Converts hash of a tag value to a color for tag background */
	getTagColor(tagHash) {
		if (tagHash % 100 < 33) {	
			return {background: "#FFF48E"};
		}
		if (tagHash % 100 < 66) {
			return {background: "#90DBAE"};
		}
		return {background: "#B4D0FA"};
	}

	incrementPlusOnes = () => {
		this.setState({
			currentThought: update(this.state.currentThought, {plusOnes: {$set: this.state.currentThought.plusOnes+1}})
		})
	}

	resetPlusOnes = () => {
		this.setState({
			currentThought: update(this.state.currentThought, {plusOnes: {$set: 0}})
		});
	}

	getReplies = () => {
		var replies = [];
		for (let [timestamp, content] of this.state.currentThought.replies) {
			replies.push(
				<div key={timestamp} class="thought-reply-box thought-reply-item">
					{content}
					<div class="thought-reply-timestamp">{quickFormat(timestamp)} 
						<Popover
						    isOpen={this.state.showPopoverReplyId == timestamp}
						    position={'right'} // preferred position
						    content={(
						        <div className="thought-reply-delete" onClick={this.deleteReply.bind(this, timestamp)}>
						            Remove
						        </div>
						    )}
						>
							<div className="thought-reply-options" onClick={() => {if (this.state.showPopoverReplyId === timestamp){this.setState({showPopoverReplyId: ""});}else{this.setState({showPopoverReplyId: timestamp})}}} onClickOutside={() => this.setState({showPopoverReplyId: ""})}></div>
						</Popover>
					</div>
				</div>
			);
		}

		return replies;
	}

	clearReply = () => {
		document.getElementById("thought-reply").value = "";

		this.setState({
			hasReplyContent: false
		});
	}

	deleteReply = (key) => {
		this.setState({
			showPopoverReplyId: "",
			currentThought: update(this.state.currentThought, {replies: {$remove: [key]}})
		});
	}

	saveReply = () => {
		const reply = document.getElementById("thought-reply").value;
		const currTimestamp = new Date().getTime();
		this.setState({
			isDeletePopoverOpen: false,
			currentThought: update(this.state.currentThought, {replies: {$add: [[currTimestamp,reply]]}})
		},
		() => {
			console.log(this.state.currentThought.replies);
		});

		this.clearReply();
	}

	getTags = () => {
		var tagItems = [];

		if (this.props.mode === "review") {
			tagItems.push(
				<div className="thought-tag-bubble" style={{background: "#E0E0E0"}}>
	  			<span className="pointer" onClick={this.incrementPlusOnes}>+{this.state.currentThought.plusOnes}</span>
	  			{ this.state.currentThought.plusOnes > 0 ?
		  			<img src="/img/crosshairs.svg" onClick={this.resetPlusOnes} className="thought-tag-bubble-delete pointer"/> : null
	  			}
	  			</div>);
		}

		for (let [key, value] of this.state.currentThought.tags) {
			tagItems.push(
	  			<div className="thought-tag-bubble" key={key} style={this.getTagColor(key)}>
	  				{value} <img src="/img/crosshairs.svg" className="thought-tag-bubble-delete pointer"  onClick={this.deleteTag.bind(this, key)}/>
	  			</div>);
		}
	  	return tagItems;
	}

	/* Saves a tag value if unique and not empty */
	saveTag = () => {
		//TODO: Error if submit without value
		var tagVal = document.getElementById("tag-input").value;
		if (tagVal != "") {
			const tagHash = this.stringHash(tagVal);

			var uniqueString = !(tagHash in this.state.currentThought.tags);

			if (uniqueString) {
				this.setState({
					hasTagContent: false,
					currentThought: update(this.state.currentThought, {tags: {$add: [[tagHash, tagVal]]}})
				});
			}
	 		document.getElementById("tag-input").value = "";
		}
	}

	/* Tags a tag key and deletes it from the tag list (if exists) 
	TODO: Convert tag list to a dictionary
	*/
	deleteTag = (key) => {
		if (this.state.currentThought.tags.has(key)) {
			this.setState({
				currentThought: update(this.state.currentThought, {tags: {$remove: [key]}})
			});
		}
	}

	/* Changes the selected category */
	changeCategory = (newCategory) => {
		console.log(newCategory);
		this.setState({
			currentThought: update(this.state.currentThought, 
				{
					completed: {$set: false},
					category: {$set: newCategory.value},
				})
		}, ()=>{console.log(this.state.currentThought.category)});
	}

	toggleThoughtComplete = () => {
		this.setState({
			currentThought: update(this.state.currentThought, 
				{
					completed: {$set: !this.state.currentThought.completed},
				})
		},
		() => {console.log(this.state.currentThought.completed)});
	}

	getFinishOrUpdateButton = () => {
		if (this.state.currentlySaving) {
			return <div className="thought-saving-loader"></div>;
		} else if (this.state.saveSuccess) {
			return <img className="thought-checkmark" src="/img/checkmark.svg"/>;
		} else {
			if (this.props.mode === "review") {
				return <div className="thought-update pointer" onClick={this.updateThought}>Update Thought</div>;
			} else if (this.state.hasTypedInfo) {
				return <div className="thought-update pointer" onClick={this.saveNewThought}>Finish Thought</div>;
			} else {
				return <div className="thought-update thought-update-disabled">Finish Thought</div>;
			}
		}
	}

	updateThought = () => {
		var component = this;

		const title = document.getElementById("thought-title-area").value;
		const content = document.getElementById("thought-content-area").value;
		component.setState({
			currentlySaving: true,
			currentThought: update(component.state.currentThought, 
			{
				title: {$set: title},
				content: {$set: content}
			})
		}, function() {
			updateThought(component.state.currentThought)
				.then(function(editTimestamp) {
					component.setState({
						currentThought: update(component.state.currentThought, 
						{
							lastEditedTimestampMs: {$set: editTimestamp}
						})
					});
				}, function(err) {
					console.log(err);
				})
				.then(() => {
					//TODO: Should take into account success or failure
					component.setState({
						currentlySaving: false,
						saveSuccess: true
					}, () => {
						console.log("let it be");
						setTimeout(() => {
							component.setState({
								saveSuccess: false
							})
						}, 1000);
					});
				});
		});
	}

	saveNewThought = () => {
		var component = this;
		const title = document.getElementById("thought-title-area").value;
		const content = document.getElementById("thought-content-area").value;
		this.setState({
			currentlySaving: true,
			currentThought: update(this.state.currentThought, 
			{
				title: {$set: title},
				content: {$set: content}
			})
		}, function() {
			saveThought(this.state.currentThought)
				.then(function(result) {
					if (result.showSuggestReviewScreen) {
						component.setState({
							currentlySaving: false,
							saveSuccess: false,
							showSuggestReviewScreen: true
						});
					} else {
						//TODO: Should take into account success or failure
						component.setState({
							currentlySaving: false,
							saveSuccess: true
						}, () => {
							const thoughtContainer = document.getElementById("thought-container");

							thoughtContainer.classList.add("thought-card-animated");
							thoughtContainer.classList.add("animated");
							thoughtContainer.classList.add("fadeOutDown");
							setTimeout(() => {
								component.clearThought();

								thoughtContainer.classList.remove("thought-card-animated");
								thoughtContainer.classList.remove("animated");
								thoughtContainer.classList.remove("fadeOutDown");

								thoughtContainer.classList.add("thought-card-animated");
								thoughtContainer.classList.add("animated");
								thoughtContainer.classList.add("fadeInDown");
								setTimeout(() => {
									thoughtContainer.classList.remove("thought-card-animated");
									thoughtContainer.classList.remove("animated");
									thoughtContainer.classList.remove("fadeInDown");
								}, 1000);
							}, 1000);
						});
					}
				}, function(err) {
					console.log(err);
				});
		});
	}

	resetThoughtData = () => {
		this.setState({
			currentlySaving: false,
			saveSuccess: false,
			currentThought: {
				id: null,
				title: null,
				content: null,
				creationTimestampMs: null,
				tags: new Map(),
				category : 0,
				replies: new Map(),
				plusOnes: 1,
				lastEditedTimestampMs: null,
				lastReviewedTimestampMs: null,
				deleted: false,
			},
		});
	}

	getClearOrDelete = () => {
		if (this.props.mode === "home") {
			if (this.state.hasTypedInfo) {
				return <div className="thought-delete-enabled pointer" onClick={this.clearThought}>Clear</div>;
			} else {
				return <div className="thought-delete-disabled">Clear</div>;
			}
		} else {
			return <DeleteModal deleteThought={this.deleteThought}/>;
		}
	}

	/* Clears an unsaved thought */
	clearThought = () => {
		this.resetThoughtData();
		this.setState({
			hasTitle: false,
			hasContent: false,
			hasTagContent: false,
			hasTypedInfo: false,
		});
		document.getElementById("tag-input").value = "";
		document.getElementById("thought-title-area").value = "";
		document.getElementById("thought-content-area").value = "";
		this.setFocusToContent();
	}


	/* Deletes a saved thought */
	deleteThought = () => {
		this.resetThoughtData();
		this.setState({
			hasTitle: false,
			hasContent: false,
			hasTagContent: false,
			hasTypedInfo: false,
		});
		document.getElementById("tag-input").value = "";
		document.getElementById("thought-title-area").value = "";
		document.getElementById("thought-content-area").value = "";
		this.setFocusToContent();
	}

	/* Focuses content textarea for autotyping */
	setFocusToContent() {
		document.getElementById("thought-content-area").focus();
	}

	denyReviewScreen = () => {
		this.setState({
			showSuggestReviewScreen: false,
		});	
	}

	  render() {
	  	return ( 
	  		this.state.showSuggestReviewScreen ?
				<div className="review-more-container">
		  			<div className="review-more-text">
		  				Would you like to review some old thoughts?
		  			</div>
		  			<div className="review-more-buttons">
		  				<div className="nav-button" onClick={this.denyReviewScreen}>Not right now</div>
		  				<div className="nav-button home-button" onClick={this.props.setPage.bind(this, "review")}> Sure, let's do it </div>
		  			</div>
		  		</div> 
	  			:
	  		<div className="thought-card-container" id="thought-container">
		  		<div className="thought-card" id="thought-card">
		  			<div className="thought-top-box">
		  				<div className="thought-title-row">

		  					{this.props.mode === "review" ? 
		  					<div className="thought-review-addons">
		  						<div className="thought-created-at">Created at <span id="created-at-formatted">{prettyFormat(this.state.currentThought.creationTimestampMs)}</span></div>
		  					</div> : null}
		  					<TextareaAutosize className="thought-title" placeholder="Title" onChange={this.onTitleUpdate} maxRows={3} id="thought-title-area"/>
		  				</div>
		  				<div className="thought-clear">
		  				{this.getClearOrDelete()}
		  				</div>
		  			</div>
		  			<div className="thought-content-box"><TextareaAutosize className="thought-content" placeholder="What's on your mind?" onChange={this.onContentUpdate} maxRows={15} id="thought-content-area" minrows={3}/></div>
		  			<div className="thought-bottom-box">
		  				<div className="thought-bottom-row">
		  					<div className={this.props.mode === "review" ? "thought-tag-bubbles thought-tag-bubbles-limited" : "thought-tag-bubbles"}>
		  						{this.getTags()}
		  					</div>
		  					{this.props.mode === "review" ? 
		  						<div className="thought-edited-at"><div className="thought-edited-at-timestamp">Edited <span id="edited-at-formatted">{dateAwareFormat(this.state.currentThought.lastEditedTimestampMs)}</span></div></div>
		  					 : null}
		  				</div>
		  				<div className="thought-bottom-row">
			  				<div className="thought-add-tags">
			  					<img src="/img/tag.svg" className="thought-tag-icon"/>
			  					<input type="text" className="thought-tag-input" placeholder="Add New Tag..." onChange={this.onTagUpdate} onKeyUp={this.onTagKeyUp} id="tag-input" maxLength="25"/>
			  					{ this.state.hasTagContent ? <img src="/img/checkmark.svg" className="thought-checkmark" onClick={this.saveTag}/> : null}
			  				</div>
			  				<CategoryComponent updateCategory={this.changeCategory} defaultCategory={this.state.currentThought.category}/>
			  				{
			  					this.props.mode === "review" && this.state.currentThought.category == 1 ?
			  					<div className="thought-complete" onClick={this.toggleThoughtComplete}>
			  						<div className={this.state.currentThought.completed ? "thought-checkmark-toggle thought-completed" : "thought-checkmark-toggle"}></div>
			  					</div>
			  					: null
			  				}
			  				<div className="thought-update">
			  					{this.getFinishOrUpdateButton()}
			  				</div>
		  				</div>
		  			</div>
		  		</div>
		  		{this.props.mode === "review" ? 
		  			<div className="thought-replies">
		  				{this.getReplies()}
		  				<div className="thought-reply-box">
		  					<TextareaAutosize className="thought-reply-input" placeholder="Reply" maxRows={3} onChange={this.onReplyUpdate} id="thought-reply"/>
		  					{ this.state.hasReplyContent ?
		  					<div className="thought-reply-action">
		  						<div className="thought-reply-clear pointer" onClick={this.clearReply}>
		  							Clear
		  						</div>
		  						<div className="thought-reply-submit pointer" onClick={this.saveReply} onKeyUp={this.onReplyKeyUp}>
		  							Reply
		  						</div>
		  					</div>
		  					: null }
		  				</div>
		  			</div>
		  		: null
		  		}
	  		</div>
	  		
	  		);
  }
}
export default ThoughtCard;