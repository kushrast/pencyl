import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Icon extends Component {
//TODO: Will need prop types for WithRouter

	getImageForPage = () => {
		if (this.props.location.pathname == "/") {
			return "/img/pen.svg";
		} else if (this.props.location.pathname == "/review") {
			return "/img/magnifying_glass.svg";
		} else if (this.props.location.pathname == "/view") {
			return "/img/review_glasses.svg";
		} else {
			return "/img/pen.svg";
		}
	}

  render() {
  	return (
	  	<div className="icon-container">
	  		<img className="icon-image pointer" src={this.getImageForPage()} alt="Main Icon" onClick={()=>{if (this.props.location != "/"){this.props.history.push("/")}}}/>
	  	</div>
  	);
  }
}
export default withRouter(Icon);