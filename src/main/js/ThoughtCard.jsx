import React, { Component } from 'react';
import CategoryComponent from './CategoryComponent.jsx';
import TextareaAutosize from 'react-autosize-textarea';
import DeleteModal from './DeleteModal.jsx';
import "./css/ThoughtCard.css";

class ThoughtCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasTitle: false,
			hasContent: false,
			hasTagContent: false,
			hasTypedInfo: false,
			tags: [],
		}

		this.onTitleUpdate = this.onTitleUpdate.bind(this);
		this.onContentUpdate = this.onContentUpdate.bind(this);
		this.onTagUpdate = this.onTagUpdate.bind(this);
		this.onTagKeyUp = this.onTagKeyUp.bind(this);
		this.onTagSubmit = this.onTagSubmit.bind(this);
		this.getTagHash = this.getTagHash.bind(this);
		this.deleteTag = this.deleteTag.bind(this);
		this.checkIfTitleOrContentPresent = this.checkIfTitleOrContentPresent.bind(this);
		this.deleteUnsavedThought = this.deleteUnsavedThought.bind(this);
		this.returnFocusToContent = this.returnFocusToContent.bind(this);
	}

	componentDidMount() {
		document.getElementById("thought-content-area").focus();
	}

	onTitleUpdate(e) {
		var title = e.target.value;

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

	checkIfTitleOrContentPresent() {
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

	onContentUpdate(e) {
		var content = e.target.value;

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

	onTagUpdate(e) {
		var tagContent = e.target.value;

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

	onTagKeyUp(e) {
		if (e.keyCode === 13) {
			this.onTagSubmit();
		}
	}

	getTagHash(s) {
		for(var i = 0, h = 0; i < s.length; i++)
			h = Math.imul(31, h) + s.charCodeAt(i) | 0;

		return Math.abs(h)
	}

	getTagColor(hash) {
		if (hash % 100 < 33) {
			return {background: "#FFF48E"};
		}
		if (hash % 100 < 66) {
			return {background: "#90DBAE"};
		}
		return {background: "#B4D0FA"};
	}

	onTagSubmit() {
		//TODO: Error if submit without value
		var tagVal = document.getElementById("tag-input").value;
		if (tagVal != "") {
			const stringHash = this.getTagHash(tagVal);

			var uniqueString = true;
			for (const tag of this.state.tags) {
				if (tag.key == stringHash) {
					uniqueString = false;
					break;
				}
			}

			if (uniqueString) {
				this.setState({
					hasTagContent: false,
					tags: [
						...this.state.tags,
						{
							key: stringHash,
							value: tagVal
						}
					]
				});
			}
	 		document.getElementById("tag-input").value = "";
		}
	}

	deleteTag(key) {
		var newTags = []
		for (const tag of this.state.tags) {
			if (tag.key != key) {
				newTags.push(tag);
			}
		}
		this.setState({
			tags: newTags
		});
	}

	deleteUnsavedThought() {
		this.setState({
			hasTitle: false,
			hasContent: false,
			hasTagContent: false,
			hasTypedInfo: false,
			tags: [],
		});
		document.getElementById("tag-input").value = "";
		document.getElementById("thought-title-area").value = "";
		document.getElementById("thought-content-area").value = "";
		this.returnFocusToContent();
	}

	returnFocusToContent() {
		document.getElementById("thought-content-area").focus();
	}

	  render() {
	  	const tagItems = this.state.tags.map((tag) => 
	  		<div className="thought-tag-bubble" key={tag.key} style={this.getTagColor(tag.key)}>
	  			{tag.value} <img src="/img/crosshairs.svg" className="thought-tag-bubble-delete pointer"  onClick={this.deleteTag.bind(this, tag.key)}/>
	  		</div>
	  	);

	  	return (
	  		<div className="thought-card-container thought-card-margin-add">
		  		<div className="thought-card">
		  			<div className="thought-top-row">
		  				<TextareaAutosize className="thought-title" placeholder="Title" onChange={this.onTitleUpdate} maxRows={2} id="thought-title-area"/>
		  				<DeleteModal hasTypedInfo={this.state.hasTypedInfo} deleteThought={this.deleteUnsavedThought} returnFocus={this.returnFocusToContent}/>
		  			</div>
		  			<div className="thought-content-box"><TextareaAutosize className="thought-content" placeholder="What's on your mind?" onChange={this.onContentUpdate} maxRows={15} id="thought-content-area"/></div>
		  			<div className="thought-bottom-box">
		  				<div className="thought-bottom-row">
		  					<div className="thought-tag-bubbles">
		  						{tagItems}
		  					</div>
		  				</div>
		  				<div className="thought-bottom-row">
			  				<div className="thought-add-tags">
			  					<img src="/img/tag.svg" className="thought-tag-icon"/>
			  					<input type="text" className="thought-tag-input" placeholder="Add New Tag..." onChange={this.onTagUpdate} onKeyUp={this.onTagKeyUp} id="tag-input" maxLength="25"/>
			  					{ this.state.hasTagContent ? <img src="/img/checkmark.svg" className="thought-tag-checkmark" onClick={this.onTagSubmit}/> : null}
			  				</div>
			  				<CategoryComponent />
			  				<div className="thought-update">
				  				{this.state.hasTypedInfo ?
				  					<div className="thought-update pointer">Finish Thought</div> : 
				  					<div className="thought-update thought-update-disabled">Finish Thought</div>
				  				}
			  				</div>
		  				</div>
		  			</div>
		  		</div>
	  		</div>
	  		
	  		);
  }
}
export default ThoughtCard;