import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import update from 'immutability-helper';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Menu from './Menu.jsx';
import Icon from './Icon.jsx';
import Search from './Search.jsx';
import HomeComponent from './HomeComponent.jsx';
import ReviewComponent from './ReviewComponent.jsx';
import AllComponent from "./AllComponent.jsx";
import LoginComponent from './LoginComponent.jsx';
import client from './client';
import "./css/app.css";
import "./css/navigate.css";

class App extends Component {
	constructor(props) {
		super(props);

		var isLoggedIn = false;
		if (userId != null && userEmail != null && userId != "" && userEmail != "") {
			isLoggedIn = true;
		}

		this.state = {
			page: "home",
			newPage: null,
			hasUnsavedContent: false,
			searchCriteria: new Map(),
			newSearchQuery: false,
			isLoggedIn: isLoggedIn,
			userEmail: "",
			userId: "",
			googleAuth: null
		}
	}

	componentDidMount() {
		var component = this;

    	gapi.load('auth2', function(){
	      // Retrieve the singleton for the GoogleAuth library and set up the client.
	      	gapi.auth2.init({
		        client_id: GCS_CLIENT_ID,
		        cookiepolicy: 'single_host_origin',
	      	}).then(function() {
	      		var auth2 = gapi.auth2.getAuthInstance();
    			component.setState({
    				googleAuth: auth2
    			});
	      	});
	    });
	}

	toggleSavedContent = (hasUnsavedContent) => {
		this.setState({
			hasUnsavedContent: hasUnsavedContent
		});
	}

	saveUserData = (userEmail, userId) => {
		console.log("hi");
		this.setState({
			isLoggedIn: true,
			userEmail: userEmail,
			userId: userId
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

	getReviewComponent = (props) => {
		console.log(this.state.isLoggedIn);
		if (this.state.googleAuth == null) {
			return "loading";
		}
		if (this.state.isLoggedIn) {
			return <ReviewComponent {...props} toggleSavedContent={this.toggleSavedContent}  hasUnsavedContent={this.state.hasUnsavedContent}/>
		} else {
			return <Redirect to='/login' />
		}
	}

	getViewComponent = (props) => {
		console.log(this.state.isLoggedIn);
		if (this.state.googleAuth == null) {
			return "loading";
		}
		if (this.state.isLoggedIn) {
			return <AllComponent {...props} toggleSavedContent={this.toggleSavedContent} hasUnsavedContent={this.state.hasUnsavedContent} searchCriteria={this.state.searchCriteria}/>
		} else {
			return <Redirect to='/login' />
		}
	}

	getHomeComponent = (props) => {
		if (this.state.googleAuth == null) {
			return "loading";
		}
		if (this.state.isLoggedIn) {
			return <HomeComponent {...props} toggleSavedContent={this.toggleSavedContent}/>
		} else {
			return <Redirect to='/login' />
		}
	}

	render() {
		return (
			<div className="container">
				<BrowserRouter>
					{ this.state.isLoggedIn ? 
						<div className="navbar">
							<Menu />
							<Icon page={this.state.page}/>
							<Search updateSearch={this.updateSearch} userEmail={this.userEmail}/>
						</div>
						: null
					}
					
					<Switch>
						<Route path="/review" render={(props)=> this.getReviewComponent(props)} />
						<Route path="/login" render={(props)=> <LoginComponent {...props} googleAuth={this.state.googleAuth} saveUserData={this.saveUserData}/>} />
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