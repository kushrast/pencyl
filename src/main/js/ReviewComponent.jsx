import React, { Component } from 'react';
import ThoughtCard from "./ThoughtCard.jsx";
import {getThoughtsToReview, finishReviewingThoughts} from "./Storage.js";
import "./css/review.css";
import "./css/ThoughtCard.css";

class ReviewComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: 1,
			reviewIds: [],
			showReviewMoreScreen: false,
		}

	}

	componentDidMount() {
		this.loadMoreReviews();
	}

	loadMoreReviews = () => {
		let component = this;
		getThoughtsToReview().then(
			function(result) {
				component.setState({
					reviewIds: result,
					showReviewMoreScreen: false,
					active: 1
				}, () => {
				});
			},
			function(err) {
				console.log(err);
			}
		);
	}

	getNavDotClasses = (index) => {
		if (index == this.state.active) {
			return "pointer nav-dot nav-active";
		} else {
			return "pointer nav-dot";
		}
	}

	switchActive = (index) => {
		if (index < 1) {
			return;
		} else if (index > this.state.reviewIds.length) {
			finishReviewingThoughts();
			this.setState({
				showReviewMoreScreen: true
			});
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

		var firstAnimation = "fadeOutLeft";
		var secondAnimation = "fadeInRight";
		if (this.state.active > index) {
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

			this.setState({
				active: index,
			}, () => {
				setTimeout(() => {
					thoughtContainer.classList.remove("animated");
					thoughtContainer.classList.remove(secondAnimation);
					thoughtContainer.classList.remove("faster");
				}, 500);
			});
		}, 500);
	}

	getNavDots = () => {
		var navDots = [];
		for (var i = 0; i < this.state.reviewIds.length; i++) {
			navDots.push(<div key={i} onClick={this.switchActive.bind(this, i+1)} className={this.getNavDotClasses(i+1)}></div>);
		}

		return navDots;
	}

  render() {
  	return (
	  	<div className="review-container">
	  	{ this.state.showReviewMoreScreen ? 
	  		<div className="review-more-container">
	  			<div className="review-more-text">
	  				🎉  You reviewed {this.state.reviewIds.length} entries!  🎉
	  			</div>
	  			<div className="review-more-buttons">
	  				<div className="nav-button home-button" onClick={()=>{this.props.history.push("/")}}>Back to home </div>
	  				<div className="nav-button" onClick={this.loadMoreReviews}> Review More </div>
	  			</div>
	  		</div> 
	  		: 
	  		<div>
		  	{ (this.state.reviewIds.length > 0) ? 
		  		<div>
			  		<div className="nav-dots">
			  			{this.getNavDots()}
			  		</div>
			  		<ThoughtCard location={this.props.location} thoughtId={this.state.reviewIds[this.state.active-1]} toggleSavedContent={this.props.toggleSavedContent} hasUnsavedContent={this.props.hasUnsavedContent}/>
			  		<div className="nav-buttons">
			  			<div className="prev-button-container"><div className="nav-button prev-button nav-button-disabled" id="prevButton" onClick={this.switchActive.bind(this, this.state.active-1)}>Previous</div></div>
			  			<div className="next-button-container"><div className="nav-button next-button nav-button-active" id="nextButton" onClick={this.switchActive.bind(this, this.state.active+1)}>
			  				{ (this.state.reviewIds.length === this.state.active) ? <span>Finish Reviewing</span> : <span>Review Another</span>}
			  			</div></div>
			  		</div>
		  		</div>
		  	:
		  	<div className="review-more-container">
	  			<div className="review-more-text">
	  				You have no thoughts to review
	  			</div>
	  			<div className="review-more-buttons">
	  				<div className="nav-button" onClick={()=>{this.props.history.push("/")}}>Make some thoughts</div>
	  			</div>
	  		</div>
		  }
		  	</div>
	  	}
	  	</div>
  	);
  }
}
export default ReviewComponent;