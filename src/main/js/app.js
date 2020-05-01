import React, { Component } from 'react';
import Menu from './Menu.jsx';
import Icon from './Icon.jsx';
import Search from './Search.jsx';
import HomeComponent from './HomeComponent.jsx';
import ReviewComponent from './ReviewComponent.jsx';
import AllComponent from "./AllComponent.jsx";
import ReactDOM from 'react-dom';
import client from './client';
import Modal from 'react-modal';
import update from 'immutability-helper';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/app.css";
import "./css/navigate.css";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			page: "home",
			newPage: null,
			hasUnsavedContent: false,
			searchCriteria: new Map(),
		}
	}

	toggleSavedContent = () => {
		this.setState({
			hasUnsavedContent: !this.state.hasUnsavedContent
		});
	}

	updateSearch = (item, action) => {
		if (action.action === "select-option") {
			this.setState({
				searchCriteria: update(this.state.searchCriteria, 
				{$add: [[item.label, item]]}
				)
			},
			()=>{
				console.log(item);
				console.log(this.state.searchCriteria);
			});
		} else if (action.action === "remove-value") {
			this.setState({
				searchCriteria: update(this.state.searchCriteria, 
				{$remove: [item.label]}
				)
			});
		}
	}

	render() {
		return (
			<div className="container">
				<BrowserRouter>
					<div className="navbar">
						<Menu />
						<Icon page={this.state.page}/>
						<Search updateSearch={this.updateSearch}/>
					</div>
					<Switch>
						<Route path="/review" render={(props)=> <ReviewComponent {...props} toggleSavedContent={this.toggleSavedContent}  hasUnsavedContent={this.state.hasUnsavedContent}/>} />

						<Route path="/view" render={(props)=> <AllComponent {...props} toggleSavedContent={this.toggleSavedContent} hasUnsavedContent={this.state.hasUnsavedContent} searchCriteria={this.state.searchCriteria}/> }/>
						<Route path="/" render={(props)=> <HomeComponent {...props} toggleSavedContent={this.toggleSavedContent}/>} />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

Modal.setAppElement('#app');

ReactDOM.render(
	<App />,
	document.getElementById('app')
);