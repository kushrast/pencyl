import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Icon extends Component {
	getImageForPage = () => {
		if (this.props.location.pathname == "/") {
			return "/img/pen.svg";
		} else if (this.props.location.pathname == "/review") {
			return "/img/review_glasses.svg";
		} else if (this.props.location.pathname == "/view") {
			return "/img/magnifying_glass.svg";
		} else {
			return "/img/pen.svg";
		}
	}

  render() {
  	return (
	  	<div className="icon-container">
	  		<img className="icon-image" src={this.getImageForPage()} alt="Main Icon"/>
	  	</div>
  	);
  }
}
export default withRouter(Icon);