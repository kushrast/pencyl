import React, { Component } from 'react';
import ThoughtCard from "./ThoughtCard.jsx";
import "./css/home.css"

class HomeComponent extends Component {
  render() {
  	return (
	  	<div className="home-container">
	  		<ThoughtCard mode={"home"}/>
	  	</div>
  	);
  }
}
export default HomeComponent;