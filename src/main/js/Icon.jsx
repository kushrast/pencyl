import React, { Component } from 'react';

class Icon extends Component {

	getImageForPage = () => {
		console.log(this.props.page);
		if (this.props.page == "home") {
			return "/img/pen.svg";
		} else if (this.props.page == "review") {
			return "/img/magnifying_glass.svg";
		} else if (this.props.page == "all") {
			return "/img/review_glasses.svg";
		} else {
			return "/img/pen.svg";
		}
	}

  render() {
  	return (
	  	<div className="icon-container">
	  		<img className="icon-image pointer" src={this.getImageForPage()} alt="Main Icon" onClick={this.props.togglePage}/>
	  	</div>
  	);
  }
}
export default Icon;