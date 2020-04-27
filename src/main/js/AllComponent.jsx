import React, { Component } from 'react';
import {prettyFormat} from "./TimeFormatUtils.js";
import EntryViewComponent from "./EntryViewComponent.jsx";
import MiniCardComponent from "./MiniCardComponent.jsx";
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
		console.log(this.props.searchCriteria);
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
			console.log("searching");
			searchThoughts(component.props.searchCriteria)
			.then(
				function(thoughts) {
					component.setState({
						items: thoughts,
						acive: 0
					}, ()=>{console.log(component.state.items)});
				}, function(err) {
					console.log(err);
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
	  			<div class="all-mini-cards">
	  				{this.getMiniCards()}
	  			</div>
	  			:
	  			<EntryViewComponent reviewIds={this.state.items} active={this.state.active} setActive={this.setActive} toggleSavedContent={this.props.toggleSavedContent} backToEntries={this.backToEntries}/>
	  		}
	  	</div>
  	);
  }
}
export default AllComponent;