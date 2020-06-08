import React, { Component } from 'react';

import ThoughtCard from "./ThoughtCard.jsx";
const axios = require('axios').default;
import {getThoughtToReview} from "./Storage.js";
import "./css/review.css";
import "./css/ThoughtCard.css";

class ReviewComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reviewId: null,
			showTutorialEndScreen: false,
			tutorial: false
		}

	}

	componentDidMount() {
		this.loadReview();
	}

	loadReview = () => {
		let component = this;
		console.log(this.state.reviewId);

		var reviewedId = this.state.reviewId === null ? "" : this.state.reviewId;
		getThoughtToReview(reviewedId).then(
			function(result) {
				if (result.tutorial) {
					component.setState({
						reviewId: result.thoughtId,
						showTutorialEndScreen: false,
						tutorial: true
					})
				} else {
					component.setState({
						reviewId: result.thoughtId,
						showTutorialEndScreen: false,
						tutorial: false
					}, () => {
					});
				}
			},
			function(err) {
				console.log(err);
			}
		);
	}

	finishTutorial = () => {
		var component = this;
		if (this.state.tutorial) {
			axios({
			  method: 'post',
			  url: '/v2/finishReviewTutorial',
			})
			.then(function(response) {
				component.setState({
					showTutorialEndScreen: true
				});
			}, function(err) {
				component.setState({
					showTutorialEndScreen: true
				});
			});
		}
	}

  render() {
  	return (
	  	<div className="review-container">
	  	{ this.state.showTutorialEndScreen ? 
	  		<div className="show-text-container">
	  			<div className="show-text">
	  				<span> You've got the hang of it! Come back later after taking more notes. </span>
	  			</div>
	  			<div className="show-more-buttons">
	  				<div className="nav-button" onClick={()=>{this.props.history.push("/")}}>Back to home </div>
	  			</div>
		  			{ /*<div className="show-more-buttons">
		  				<div className="nav-button home-button" onClick={()=>{this.props.history.push("/")}}>Back to home </div>
		  				<div className="nav-button" onClick={this.loadReview}> Review More </div>
		  			</div*/}

	  		</div> 
	  		: 
	  		<div>
		  	{ (this.state.reviewId != null) ? 
		  		<div>
		  			{
		  				this.state.tutorial ? 
		  				<div className="review-tutorial-card">
		  					<div style={{textAlign:"center", marginBottom:"25px"}}> Tutorial: Reflect Mode </div>
		  					<div>
		  						In Reflect Mode, Pencyl helps you review old notes by finding entries you haven’t seen or updated in a while, one thought at a time. While in Reflect mode, you can also edit a thought and add comments/replies, as well as add +1’s to the note by clicking on the +1 tag. If you’re done reflecting on a note, you can get a new one by clicking “Review Another” below the main note card. Below, we’ve created an example note for you to try the Reflect mode out on.
		  					</div>
		  				</div>
		  				: null
		  			}
			  		<ThoughtCard history={this.props.history} location={this.props.location} thoughtId={this.state.reviewId} toggleSavedContent={this.props.toggleSavedContent} hasUnsavedContent={this.props.hasUnsavedContent}/>
			  		<div className="nav-buttons">
			  			<div className="prev-button-container"><div className="nav-button prev-button" id="nextButton" onClick={() => {this.props.history.push("/")}}>
			  			Back to Home
			  			</div></div>
			  			<div className="next-button-container"><div className="nav-button next-button nav-button-active" id="nextButton" >
			  				{
			  					this.state.tutorial ?
			  					<span onClick={this.finishTutorial}> Finish Tutorial </span>
			  					:
			  					<span onClick={this.loadReview}>Review Another</span>
			  				}

			  			</div></div>
			  		</div>
		  		</div>
		  	:
		  	<div className="review-more-container">
	  			<div className="review-more-text">
	  				You have no notes to review! Come back later after taking more notes.
	  			</div>
	  			<div className="review-more-buttons">
	  				<div className="nav-button" onClick={()=>{this.props.history.push("/")}}> Back to home </div>
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