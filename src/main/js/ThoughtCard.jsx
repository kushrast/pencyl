import React, { Component } from 'react';
import CategoryComponent from './CategoryComponent.jsx';
import TextareaAutosize from 'react-autosize-textarea';
import DeleteModal from './DeleteModal.jsx';
import update from 'immutability-helper';
import {saveThought} from "./Storage.js";
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
				replies: {},
				stars: 0,
				lastEditedTimestampMs: null,
				lastReviewedTimestampMs: null,
				deleted: false,
			},
			hasTitle: false,
			hasContent: false,
			hasTagContent: false,
			hasTypedInfo: false,
			currentlySaving: false,
			saveSuccess: false,
		}
	}

	componentDidMount() {
		this.setFocusToContent();
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

	/* Triggered on keyup from tag input. Submits tag if pressed key was a space */
	onTagKeyUp = (event) => {
		if (event.keyCode === 13) {
			this.saveTag();
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

	getTags = () => {
		var tagItems = [];
		for (let [key, value] of this.state.currentThought.tags) {
			tagItems.push(
	  		<div className="thought-tag-bubble" key={key} style={this.getTagColor(key)}>
	  			{value} <img src="/img/crosshairs.svg" className="thought-tag-bubble-delete pointer"  onClick={this.deleteTag.bind(this, key)}/>
	  		</div>);
		}

		console.log(tagItems);
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
			currentThought: {
				...this.state.currentThought,
				category: newCategory
			}
		});
	}

	getFinishOrUpdateButton = () => {
		if (this.state.currentlySaving) {
			return <div className="thought-saving-loader"></div>;
		} else if (this.state.saveSuccess) {
			return <img className="thought-checkmark" src="/img/checkmark.svg"/>;
		} else {
			if (this.state.hasTypedInfo) {
				return <div className="thought-update pointer" onClick={this.saveNewThought}>Finish Thought</div>;
			} else {
				return <div className="thought-update thought-update-disabled">Finish Thought</div>;
			}
		}
	}

	saveNewThought = () => {
		this.setState({
			currentlySaving: true
		}, function() {
			saveThought(this.state.currentThought)
				.then(function(result) {
					console.log(result);
				}, function(err) {
					console.log(err);
				})
				.then(() => {
					//Should take into account success or failure
					this.setState({
						currentlySaving: false,
						saveSuccess: true
					}, () => {
						setTimeout(() => {
							const thoughtContainer = document.getElementById("thought-container");

							thoughtContainer.classList.add("thought-card-animated");
							thoughtContainer.classList.add("animated");
							thoughtContainer.classList.add("fadeOutLeft");
							setTimeout(() => {
								this.clearThought();

								thoughtContainer.classList.remove("thought-card-animated");
								thoughtContainer.classList.remove("animated");
								thoughtContainer.classList.remove("fadeOutLeft");
							}, 1000)
						}, 1000);
					});
				})
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
				replies: {},
				stars: 0,
				lastEditedTimestampMs: null,
				lastReviewedTimestampMs: null,
				deleted: false,
			},
		});
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

	/* Focuses content textarea for autotyping */
	setFocusToContent() {
		document.getElementById("thought-content-area").focus();
	}

	  render() {

	  	return (
	  		<div className="thought-card-container" id="thought-container">
		  		<div className="thought-card">
		  			<div className="thought-top-row">
		  				<TextareaAutosize className="thought-title" placeholder="Title" onChange={this.onTitleUpdate} maxRows={3} id="thought-title-area"/>

		  				<div className="thought-clear">
		  				{this.state.hasTypedInfo ? <div className="thought-delete-enabled pointer" onClick={this.clearThought}>Clear</div> : <div className="thought-delete-disabled">Clear</div>}
		  				</div>
		  				{/*<DeleteModal hasTypedInfo={this.state.hasTypedInfo} deleteThought={this.deleteUnsavedThought} returnFocus={this.returnFocusToContent}/> */}
		  			</div>
		  			<div className="thought-content-box"><TextareaAutosize className="thought-content" placeholder="What's on your mind?" onChange={this.onContentUpdate} maxRows={15} id="thought-content-area" minrows={3}/></div>
		  			<div className="thought-bottom-box">
		  				<div className="thought-bottom-row">
		  					<div className="thought-tag-bubbles">
		  						{this.getTags()}
		  					</div>
		  				</div>
		  				<div className="thought-bottom-row">
			  				<div className="thought-add-tags">
			  					<img src="/img/tag.svg" className="thought-tag-icon"/>
			  					<input type="text" className="thought-tag-input" placeholder="Add New Tag..." onChange={this.onTagUpdate} onKeyUp={this.onTagKeyUp} id="tag-input" maxLength="25"/>
			  					{ this.state.hasTagContent ? <img src="/img/checkmark.svg" className="thought-checkmark" onClick={this.saveTag}/> : null}
			  				</div>
			  				<CategoryComponent updateCategory={this.changeCategory}/>
			  				<div className="thought-update">
			  					{this.getFinishOrUpdateButton()}
			  				</div>
		  				</div>
		  			</div>
		  		</div>
	  		</div>
	  		
	  		);
  }
}
export default ThoughtCard;