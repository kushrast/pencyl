import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import "./css/topbarmenu.css";

class TopBarMenu extends Component {
	constructor(props) {
		super(props);
	}

	getClasses = (path) => {
		if (path == this.props.location.pathname) {
			return "menu-active";
		} else {
			return "menu-inactive pointer";
		}
	}

  render() {
  	var styles = {
		bmMenuWrap: {
		  transition: '0.25s'
		}
	}
  	return (
	  	<div className="top-menu-container">
	  		<img src="/img/logo_color_transparent.png" className="menu-logo pointer" alt="Menu Logo" onClick={()=>{this.props.history.push("/")}}/> 
  			<NavLink className={this.getClasses("/")} to="/"> + New </NavLink>
  			<NavLink className={this.getClasses("/review")} to="/review"> Reflect </NavLink>
  			<NavLink className={this.getClasses("/view")} to="/view"> All Entries </NavLink>
	  	</div>
  	);
  }
}
export default withRouter(TopBarMenu);