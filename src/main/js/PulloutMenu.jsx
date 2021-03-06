import React, { Component } from 'react';
import {slide as SlideMenu} from 'react-burger-menu';
import { NavLink } from 'react-router-dom';

class PulloutMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
		}
	}

	 // This keeps your state in sync with the opening/closing of the menu
	  // via the default means, e.g. clicking the X, pressing the ESC key etc.
	  handleStateChange (state) {
	    this.setState({isOpen: state.isOpen})  
	  }

	changePage = (page) => {
		this.setState({
			isOpen: false,
		});
	}

  render() {
  	var styles = {
		bmMenuWrap: {
		  transition: '0.25s'
		}
	}
  	return (
	  	<div className="menu-container">
	  		{/* <img className="menu-logo" src="/img/menu_logo.svg" alt="Menu Logo" /> */}
	  		<SlideMenu customBurgerIcon={<img src="/img/burger_menu.svg"/>} menuClassName={"menu-overlay"} disableAutoFocus styles={styles} width={300} isOpen={this.state.isOpen} onStateChange={(state) => this.handleStateChange(state)}>
	  			<div>
	  				<div className="bm-burger-button-inverted"/>
	  			</div>
	  			<a className="list-item pointer"><NavLink className="list-item-text" to="/" onClick={this.changePage}> Home </NavLink></a>
	  			<a className="list-item pointer"><NavLink className="list-item-text" to="/review" onClick={this.changePage}> Review </NavLink></a>
	  			<a className="list-item pointer"><NavLink className="list-item-text" to="/view" onClick={this.changePage}> All Entries </NavLink></a>
	  			{/*<a className="list-item"><div className="list-item-text"> Logout </div></a>*/}
	  		</SlideMenu>
	  	</div>
  	);
  }
}
export default PulloutMenu;