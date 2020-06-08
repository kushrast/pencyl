import React, { Component } from 'react';

import ThoughtCard from "./ThoughtCard.jsx";
import "./css/home.css"

class HomeComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showSuggestReviewScreen: false,
			showReviewTutorial: false
		}
	}

	denyReviewScreen = () => {
		this.setState({
			showSuggestReviewScreen: false,
		});	
	}

	showSuggestReviewScreen = () => {
		this.setState({
			showSuggestReviewScreen: true,
		});	
	}

	showReviewTutorial = () => {
		this.setState({
			showReviewTutorial: true,
		});	
	}


  render() {
  	return (
	  	<div className="home-container">
	  		{this.state.showSuggestReviewScreen || this.state.showReviewTutorial ?
	  			<div className="review-more-container thought-card-animated animated fadeIn">
	  				{this.state.showReviewTutorial ?
	  					<div>
				  			<div className="review-more-text">
				  				Congratulations! You just stored a note using Pencyl! Now let’s try out the Reflect mode!
				  			</div>
				  			<div className="review-more-buttons">
				  				<div className="inverted-button" onClick={()=>{this.props.history.push("/review")}}> Sure, let's do it </div>
				  			</div>
		  				</div>
		  			:
		  				<div>
				  			<div className="review-more-text">
				  				Would you like to review some old thoughts?
				  			</div>
				  			<div className="review-more-buttons">
				  				<div className="nav-button" style={{"marginRight":"8px"}} onClick={this.denyReviewScreen}>Not right now</div>
				  				<div className="inverted-button" onClick={()=>{this.props.history.push("/review")}}> Sure, let's do it </div>
				  			</div>
				  		</div>
		  			}
		  		</div>
		  		:
		  		<ThoughtCard location={this.props.location} toggleSavedContent={this.props.toggleSavedContent} showSuggestReviewScreen={this.showSuggestReviewScreen} showReviewTutorial={this.showReviewTutorial}/>}
	  	</div>
  	);
  }
}
export default HomeComponent;