import React, { Component } from 'react';
import CategoryComponent from './CategoryComponent.jsx';

class ThoughtCard extends Component {
  render() {
  	return (
  		<div className="thought-card-container thought-card-margin-add">
	  		<div className="thought-card">
	  			<div className="thought-top-row">
	  				{/* Auto-Resize the text area */}
	  				<textarea className="thought-title" placeholder="Title"/>
	  				<div className="thought-delete">
	  					Delete
	  				</div>
	  			</div>
	  			<div className="thought-content-box"><textarea className="thought-content" placeholder="What's on your mind?"/></div>
	  			<div className="thought-bottom-box">
	  				<div className="thought-bottom-row">
		  				<div className="thought-add-tags">
		  					<img src="/img/tag.svg" className="thought-tag-icon"/>
		  					{/* Need to add javascript to make underline appear even when not focused but text still exists */}
		  					<input type="text" className="thought-tag-input" placeholder="Add New Tag..."/>
		  				</div>
		  				<CategoryComponent />
		  				<div className="thought-update">
		  					{/* Update disabled or not disabled depending on whether there is text */}
		  					Save Thought
		  				</div>
	  				</div>
	  			</div>
	  		</div>
  		</div>
  		
  		);
  }
}
export default ThoughtCard;