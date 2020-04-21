import React, { Component } from 'react';

class CategoryComponent extends Component {
  render() {
  	return (
  		<div className="thought-category-container">
  			{/* Placeholder for real selector */}
  			<div className="thought-category"> Just a thought </div>
  			<img src="/img/category_arrow.svg" className="thought-category-arrow"/>
  		</div>
  		);
  }
}
export default CategoryComponent;