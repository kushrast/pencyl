import React, { Component } from 'react';
import ThoughtCard from "./ThoughtCard.jsx";
import "./css/review.css";

class ReviewComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: 1,
		}
	}

	getNavDotClasses = (index) => {
		if (index == this.state.active) {
			return "pointer nav-dot nav-active";
		} else {
			return "pointer nav-dot";
		}
	}

	switchActive = (index) => {
		if (index < 1 || index > 3) {
			return;
		}
		this.setState({
			active: index,
		});

		var prevButton = document.getElementById("prevButton");
		var nextButton = document.getElementById("nextButton");

		if (index == 1) {
			prevButton.classList.remove("nav-button-active");
			prevButton.classList.add("nav-button-disabled");
			nextButton.innerHTML = "Review Another";
		} else if (index == 2) {
			prevButton.classList.remove("nav-button-disabled");
			prevButton.classList.add("nav-button-active");
			nextButton.innerHTML = "Review Another";
		} else {
			prevButton.classList.remove("nav-button-disabled");
			prevButton.classList.add("nav-button-active");

			nextButton.innerHTML = "Finish Reviewing";
		}
	}

  render() {
  	return (
	  	<div className="review-container">
	  		<div className="nav-dots">
	  			<div onClick={this.switchActive.bind(this, 1)} className={this.getNavDotClasses(1)}></div>
	  			<div onClick={this.switchActive.bind(this, 2)} className={this.getNavDotClasses(2)}></div>
	  			<div onClick={this.switchActive.bind(this, 3)} className={this.getNavDotClasses(3)}></div>
	  		</div>
	  		<ThoughtCard mode={"review"}/>
	  		<div className="nav-buttons">
	  			<div className="prev-button-container"><div className="nav-button prev-button nav-button-disabled" id="prevButton" onClick={this.switchActive.bind(this, this.state.active-1)}>Previous</div></div>
	  			<div className="next-button-container"><div className="nav-button next-button nav-button-active" id="nextButton" onClick={this.switchActive.bind(this, this.state.active+1)}>Review Another</div></div>
	  		</div>
	  	</div>
  	);
  }
}
export default ReviewComponent;