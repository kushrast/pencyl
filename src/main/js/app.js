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

	//TODO: check that page is valid
	setPage = (page) => {
		this.setState({
			newPage: page
		}, () => {
			this.navigateToPage();
		});

	}

	toggleSavedContent = (savedContentState) => {
		console.log(savedContentState);
		this.setState({
			hasUnsavedContent: savedContentState
		});
	}

	getPage = () => {
		if (this.state.page == "home") {
			return <HomeComponent setPage={this.setPage} toggleSavedContent={this.toggleSavedContent}/>
		} else if (this.state.page == "review"){
			return <ReviewComponent setPage={this.setPage} toggleSavedContent={this.toggleSavedContent}  hasUnsavedContent={this.state.hasUnsavedContent}/>
		} else {
			return <AllComponent toggleSavedContent={this.toggleSavedContent} hasUnsavedContent={this.state.hasUnsavedContent} searchCriteria={this.state.searchCriteria}/>
		}
	}

	//TODO: Convert to numerical order
	togglePage = () => {
		var newPage = "";
		if (this.state.page == "home") {
			newPage = "review";
		} else if (this.state.page == "review") {
			newPage = "all";
		} else {
			newPage = "home";
		}

		this.setState({
			newPage: newPage
		}, () => {
			this.navigateToPage();
		});
	}

	navigateToPage = () => {
		if (this.state.hasUnsavedContent) {
			this.setState({
				showModal: true
			});
		} else {
			this.forceSetPage();
		}
	}

	forceSetPage = () => {
		this.setState({
			page: this.state.newPage,
			newPage: null,
			showModal: false
		});
	}

	handleCloseModal = () => {
		this.setState({
			newPage: null,
			showModal: false,
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
				this.setPage("all");
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
				<div className="navbar">
					<Menu setPage={this.setPage}/>
					<Icon page={this.state.page} togglePage={this.togglePage}/>
					<Search updateSearch={this.updateSearch}/>
				</div>
				{this.getPage()}

				<Modal 
		           isOpen={this.state.showModal}
	             onRequestClose={this.handleCloseModal}
		           contentLabel="Minimal Modal Example"
		           className="thought-nav-modal-container"
		           overlayClassName="thought-nav-overlay"
		           shouldCloseOnEsc={true}
		           shouldCloseOnOverlayClick={true}
	             shouldReturnFocusAfterClose={true}
		        >
	            <div className="thought-nav-modal">
		        	  <div className="thought-nav-modal-title">Are you sure you want to navigate away from this page?</div>
		        	  <div className="thought-nav-modal-content">
	                <div className="thought-nav-modal-subtitle">
	                  Your unsaved edits to this thought will be lost. 
	                </div>
	              </div>
	              <div className="thought-nav-modal-buttons">
	                <div className="thought-nav-cancel pointer" onClick={this.handleCloseModal}>Cancel</div>
	                <div className="thought-nav-separator"></div>
	                <div className="thought-nav-confirm pointer" onClick={this.forceSetPage}>Yes, Let's leave</div>
	              </div>
		        	</div>
		        </Modal>
			</div>
		);
	}
}

Modal.setAppElement('#app');

ReactDOM.render(
	<App />,
	document.getElementById('app')
);