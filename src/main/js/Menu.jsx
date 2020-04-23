import React, { Component } from 'react';
import {slide as SlideMenu} from 'react-burger-menu';

class Menu extends Component {
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
		}, () => {
			this.props.setPage(page);
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
	  		<SlideMenu customBurgerIcon={<img src="/img/burger_menu.svg"/>} menuClassName={"menu-overlay"} disableAutoFocus styles={styles} width={180} isOpen={this.state.isOpen} onStateChange={(state) => this.handleStateChange(state)}>
	  			<div>
	  				<div className="bm-burger-button-inverted" onClick={this.changePage.bind(this, "home")}/>
	  			</div>
	  			<a className="list-item pointer" onClick={this.changePage.bind(this, "home")} ><div className="list-item-text"> Home </div></a>
	  			<a className="list-item pointer" onClick={this.changePage.bind(this, "review")}><div className="list-item-text"> Review </div></a>
	  			<a className="list-item"><div className="list-item-text"> All Entries </div></a>
	  			<a className="list-item"><div className="list-item-text"> Logout </div></a>
	  		</SlideMenu>
	  	</div>
  	);
  }
}
export default Menu;