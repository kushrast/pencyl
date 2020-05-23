import React, { Component } from 'react';

import EntryViewComponent from "./EntryViewComponent.jsx";
import MiniCardComponent from "./MiniCardComponent.jsx";
import {prettyFormat} from "./TimeFormatUtils.js";
import {searchThoughts} from "./Storage.js";
import "./css/listMiniCards.css";

class AllComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listView: true,
			items: [],
			active: 0,
		};
	}

	componentDidMount() {
		var component = this;
		searchThoughts(this.props.searchCriteria)
		.then(
			function(thoughts) {
				component.setState({
					items: thoughts,
					active: 0
				});
			}, function(err) {
				console.log(err);
			});
	}

	componentDidUpdate(prevProps) {
		var component = this;
		if (prevProps.searchCriteria !== component.props.searchCriteria) {
			searchThoughts(component.props.searchCriteria)
			.then(
				function(thoughts) {
					component.setState({
						items: thoughts,
						acive: 0
					}, ()=>{});
				}, function(err) {
					console.log(err);
				});
			this.setState({
				listView: true
			});
		}
	}

	getMiniCards = () => {
		var miniCards = [];
		for(var i = 0; i < this.state.items.length; i++) {
			miniCards.push(
				<MiniCardComponent key={this.state.items[i]} thoughtId={this.state.items[i]} onClick={this.goToEntry.bind(this, i+1)}/>
				);
		}

		return miniCards;
	}

	goToEntry = (index) => {
		this.setState({
			active: index,
			listView: false,
		})
	}

	setActive = (newActive, runAfter) => {
		this.setState({
			active: newActive,
		}, runAfter);
	}

	backToEntries = () => {
		this.setState({
			listView: true,
		});
	}

  render() {
  	return (
	  	<div className="all-list-container">
	  		{this.state.listView ? 
	  			<div>
	  				{
	  					this.state.items.length == 0 ?
		  					<div className="show-text-container">
			  					<div className="show-text">
			  					{this.props.searchCriteria.size == 0 ? 
			  						<div>
				  						<span>You haven't stored any thoughts!</span>
				  						<div className="show-more-buttons">
							  				<div className="nav-button home-button" style={{marginRight:"0px"}} onClick={()=>{this.props.history.push("/")}}>Back to home </div>
							  			</div>
						  			</div>
			  						:
			  						<div>
				  						<span>No thoughts found for query</span>
				  						<div className="show-more-buttons">
							  				<div className="nav-button home-button" style={{marginRight:"0px"}} onClick={()=>{this.props.history.push("/")}}>Back to home </div>
							  			</div>
						  			</div>
						  			} 
			  					</div>
		  					</div>
	  					:
		  					<div class="all-mini-cards">
					  			{this.getMiniCards()}
					  		</div>
	  				}
  				</div>
	  			:
	  			<EntryViewComponent history={this.props.history} location={this.props.location} reviewIds={this.state.items} active={this.state.active} setActive={this.setActive} toggleSavedContent={this.props.toggleSavedContent} backToEntries={this.backToEntries}  hasUnsavedContent={this.props.hasUnsavedContent}/>
	  		}
	  	</div>
  	);
  }
}
export default AllComponent;