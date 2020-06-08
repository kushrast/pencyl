import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import update from 'immutability-helper';
import { BrowserRouter, Route, Switch } from "react-router-dom";
const axios = require('axios').default;

import TopBarMenu from './TopBarMenu.jsx';
import Icon from './Icon.jsx';
import Search from './Search.jsx';
import HomeComponent from './HomeComponent.jsx';
import ReviewComponent from './ReviewComponent.jsx';
import AllComponent from "./AllComponent.jsx";
import WelcomeComponent from "./WelcomeComponent.jsx";
import client from './client';
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
			newSearchQuery: false,
			userEmail: "",
			userId: "",
			showWelcomeTutorial: showWelcomeTutorial
		}
	}

	toggleSavedContent = (hasUnsavedContent) => {
		this.setState({
			hasUnsavedContent: hasUnsavedContent
		});
	}

	updateSearch = (item, action) => {
		if (action.action === "select-option") {
			this.setState({
				searchCriteria: update(this.state.searchCriteria, 
				{$add: [[item.label, item]]}
				)
			});
		} else if (action.action === "remove-value") {
			this.setState({
				searchCriteria: update(this.state.searchCriteria, 
				{$remove: [item.label]}
				)
			});
		}
	}

	logOut = () => {
		axios({
		  method: 'post',
		  url: '/v2/logout',
		})
		.then(function(response) {
			location.reload();
		}, function(err) {
			location.reload();
		});
	}

	finishedSignOnTutorial = () => {
		var component = this;
		axios({
		  method: 'post',
		  url: '/v2/finishedSignOnTutorial',
		})
		.then(function(response) {
			component.setState({
				showWelcomeTutorial: false
			});
		}, function(err) {
			component.setState({
				showWelcomeTutorial: false
			});		
		});
	}

	getReviewComponent = (props) => {
		return <ReviewComponent {...props} toggleSavedContent={this.toggleSavedContent}  hasUnsavedContent={this.state.hasUnsavedContent}/>;
	}

	getViewComponent = (props) => {
		return <AllComponent {...props} toggleSavedContent={this.toggleSavedContent} hasUnsavedContent={this.state.hasUnsavedContent} searchCriteria={this.state.searchCriteria}/>;
	}

	getHomeComponent = (props) => {
		if (this.state.showWelcomeTutorial) {
			return <WelcomeComponent finishedSignOnTutorial={this.finishedSignOnTutorial}/>
		}
		return <HomeComponent {...props} toggleSavedContent={this.toggleSavedContent}/>;
	}

	render() {
		return (
			<div className="container">
				<BrowserRouter>
					<div className="navbar">
							<TopBarMenu/>
							<Icon/>
							<Search updateSearch={this.updateSearch} userEmail={this.userEmail} logOut={this.logOut}/>
						</div>
					
					<Switch>
						<Route path="/review" render={(props)=> this.getReviewComponent(props)} />
						<Route path="/view" render={(props)=>  this.getViewComponent(props)}/>
						<Route path="/" render={(props)=> this.getHomeComponent(props)} />
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