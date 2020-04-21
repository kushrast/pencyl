import React, { Component } from 'react';

class ThoughtCard extends Component {
  render() {
  	return (
  		<div className="thought-card-container thought-card-margin-add">
	  		<div className="thought-card">
	  			<div className="top-row">
	  				<div className="thought-title">
	  					Title
	  				</div>
	  			</div>
	  			<div className="thought-content">What's on your mind?</div>
	  		</div>
  		</div>
  		
  		);
  }
}
export default ThoughtCard;