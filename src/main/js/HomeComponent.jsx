import React, { Component } from 'react';
import ThoughtCard from "./ThoughtCard.jsx";
import "./css/home.css"
import { withRouter } from 'react-router-dom';

class HomeComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showSuggestReviewScreen: false
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

  render() {
  	return (
	  	<div className="home-container">
	  		{this.state.showSuggestReviewScreen ?
				<div className="review-more-container">
		  			<div className="review-more-text">
		  				Would you like to review some old thoughts?
		  			</div>
		  			<div className="review-more-buttons">
		  				<div className="nav-button" onClick={this.denyReviewScreen}>Not right now</div>
		  				<div className="nav-button home-button" onClick={()=>{this.props.history.push("/review")}}> Sure, let's do it </div>
		  			</div>
		  		</div>
		  		:
	  		<ThoughtCard location={this.props.location} toggleSavedContent={this.props.toggleSavedContent} showSuggestReviewScreen={this.showSuggestReviewScreen} />}
	  	</div>
  	);
  }
}
export default HomeComponent;