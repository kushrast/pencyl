import React, { Component } from 'react';
import Menu from './Menu.jsx';
import Icon from './Icon.jsx';
import HomeComponent from './HomeComponent.jsx';
import ReviewComponent from './ReviewComponent.jsx';
import ReactDOM from 'react-dom';
import client from './client';
import Modal from 'react-modal';

import "./css/app.css";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			page: "home"
		}
	}

	//TODO: check that page is valid
	setPage = (page) => {
		this.setState({
			page: page
		});
	}

	getPage = () => {
		if (this.state.page == "home") {
			return <HomeComponent setPage={this.setPage}/>
		} else {
			return <ReviewComponent setPage={this.setPage}/>
		}
	}

	//TODO: Convert to numerical order
	togglePage = () => {
		if (this.state.page == "home") {
			this.setState({
				page: "review"
			});
		} else {
			this.setState({
				page: "home"
			});
		}
	}

	render() {
		return (
			<div className="container">
				<div className="navbar">
					<Menu setPage={this.setPage}/>
					<Icon page={this.state.page} togglePage={this.togglePage}/>
					<div className="search-bar-container"></div>
				</div>
				{this.getPage()}
			</div>
		);
	}
}

Modal.setAppElement('#app');

ReactDOM.render(
	<App />,
	document.getElementById('app')
);