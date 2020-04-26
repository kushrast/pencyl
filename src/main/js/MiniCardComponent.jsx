import React, { Component } from 'react';
import {prettyFormat} from "./TimeFormatUtils.js";
import {getThought} from "./Storage.js";
import "./css/listMiniCards.css";

class MiniCardComponent extends Component {
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
		}
	}

	componentDidMount() {
		this.loadThought();
	}

	loadThought = () => {
		const component = this;
		getThought(this.props.thoughtId).then(
			function(thought) {
				component.setState({
					currentThought: thought,
				})
			}, function(err) {
				console.log(err);
			}
		);
	}

	getTags = () => {
		var tagItems = [];

		if (this.state.currentThought.plusOnes > 1) {
		tagItems.push(
			<div className="mini-card-tag-bubble" style={{background: "#E0E0E0"}}>
  			<span>+{this.state.currentThought.plusOnes}</span>
  			</div>);
		}
		
		for (let [key, value] of this.state.currentThought.tags) {
			tagItems.push(
	  			<div className="mini-card-tag-bubble" key={key} style={this.getTagColor(key)}>
	  				{value}
	  			</div>);
		}
	  	return tagItems;
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

	getTitleClasses = () => {
		if (this.state.currentThought.title == null || this.state.currentThought.title == "") {
			return "mini-card-title italic";
		} else {
			return "mini-card-title";
		}
	}

	getTitle = () => {
		if (this.state.currentThought.title == null || this.state.currentThought.title == "") {
			return "[No Title]";
		} else {
			return this.state.currentThought.title;
		}
	}

	getContentClasses = () => {
		if (this.state.currentThought.content == null || this.state.currentThought.content == "") {
			return "mini-card-content italic";
		} else {
			return "mini-card-content";
		}
	}

	getContent = () => {
		if (this.state.currentThought.content == null || this.state.currentThought.content == "") {
			return "No thought body";
		} else {
			return this.state.currentThought.content;
		}
	}

  render() {
  	return (
		<div class="mini-card" onClick={this.props.onClick}>
  			<div className="thought-top-box">
  				<div className="mini-card-title-row">
  					<div className="mini-card-created-at">Created at <span id="created-at-formatted">{prettyFormat(this.state.currentThought.creationTimestampMs)}</span></div>
  					<div className={this.getTitleClasses()}>{this.getTitle()}</div>
  				</div>
  			</div>
  			<div className={this.getContentClasses()} id="thought-content-area">{this.getContent()}</div>
  			<div className="mini-card-bottom-box">
				<div className="mini-card-tag-bubbles">
					{this.getTags()}
				</div>
				<div className="mini-card-category">{this.state.currentThought.category == 0 ? "Just a thought" : "Action Item"}
				{
					this.state.currentThought.category == 1 ? 
					<div className={this.state.currentThought.completed ? "thought-checkmark-toggle thought-completed" : "thought-checkmark-toggle"}></div>
					: null
				}
				</div>
  			</div>
		</div>
  	);
  }
}
export default MiniCardComponent;