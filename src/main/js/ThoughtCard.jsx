import React, { Component } from 'react';

class ThoughtCard extends Component {
  render() {
  	return (
  		<div className="thought-card">
  			<div className="top-row">
  				<div className="title">
  					Title
  				</div>
  			</div>
  			<div className="content">What's on your mind?</div>
  		</div>
  		);
  }
}
export default ThoughtCard;