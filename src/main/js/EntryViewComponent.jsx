import React, { Component } from 'react';
import ThoughtCard from "./ThoughtCard.jsx";
import {getThoughtsToReview, finishReviewingThoughts} from "./Storage.js";
import "./css/ThoughtCard.css";

class EntryViewComponent extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	switchActive = (index) => {
		if (index < 1 || index > this.props.reviewIds.length) {
			return;
		}

		var prevButton = document.getElementById("prevButton");
		var nextButton = document.getElementById("nextButton");

		if (index == 1) {
			prevButton.classList.remove("nav-button-active");
			prevButton.classList.add("nav-button-disabled");
		} else {
			prevButton.classList.remove("nav-button-disabled");
			prevButton.classList.add("nav-button-active");
		}

		if (index == this.props.reviewIds.length) {
			nextButton.classList.remove("nav-button-active");
			nextButton.classList.add("nav-button-disabled");
		}

		var firstAnimation = "fadeOutLeft";
		var secondAnimation = "fadeInRight";
		if (this.props.active > index) {
			firstAnimation = "fadeOutRight";
			secondAnimation = "fadeInLeft";
		}

		const thoughtContainer = document.getElementById("thought-container");

		thoughtContainer.classList.add("animated");
		thoughtContainer.classList.add(firstAnimation);
		thoughtContainer.classList.add("faster");
		setTimeout(() => {
			thoughtContainer.classList.remove("animated");
			thoughtContainer.classList.remove(firstAnimation);

			thoughtContainer.classList.add("animated");
			thoughtContainer.classList.add(secondAnimation);

			this.props.setActive(index, 
				() => {
				setTimeout(() => {
					thoughtContainer.classList.remove("animated");
					thoughtContainer.classList.remove(secondAnimation);
					thoughtContainer.classList.remove("faster");
				}, 500);
			});
		}, 500);
	}

  render() {
  	return (
	  	<div className="entry-container">
	  		<div>
		  		<div>
			  		<ThoughtCard mode={"review"} thoughtId={this.props.reviewIds[this.props.active-1]} toggleSavedContent={this.props.toggleSavedContent} hasUnsavedContent={this.props.hasUnsavedContent}/>
			  		<div className="nav-buttons">
			  			<div className="back-button-container"><div className="nav-button all-entries-button nav-button-active" onClick={this.props.backToEntries}>Back to All entries</div></div>
			  			<div className="prev-button-container"><div className={this.props.active > 1 ? "nav-button prev-button nav-button-active" : "nav-button prev-button nav-button-disabled"} id="prevButton" onClick={this.switchActive.bind(this, this.props.active-1)}>Previous</div></div>
			  			<div className="next-button-container"><div className={this.props.active < this.props.reviewIds.length ? "nav-button next-button nav-button-active" : "nav-button next-button nav-button-disabled"} id="nextButton" onClick={this.switchActive.bind(this, this.props.active+1)}>Next</div></div>
			  		</div>
		  		</div>
		  	</div>
	  	</div>
  	);
  }
}
export default EntryViewComponent;