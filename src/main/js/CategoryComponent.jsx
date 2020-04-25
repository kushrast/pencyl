import React, { Component } from 'react';
import Select from 'react-select';

class CategoryComponent extends Component {

  render() {

	const customStyles = {
		container: (provided, state) => ({
			...provided,
			width: 'auto',
			marginLeft: '15px',
		}),
		control: (provided, state) => ({
			...provided,
			border: 'none',
			borderColor: "#FFFFFF",
			color: '#8C8C8C',
			fontFamily: 'Roboto',
			fontWeight: '400',
			fontSize: '20px',
			paddingRight: '0px',
			outline: 0,
			cursor: 'pointer'
		}),
		singleValue: (provided, state) => ({
			color: '#8C8C8C',
			fontFamily: 'Roboto',
			fontWeight: '400',
			fontSize: '20px',
		}),
		input: (provided, state) => ({
		  webkitUserSelect: 'none',
		  mozUserSelect: 'none',
		  msUserSelect: 'none',
		  userSelect: 'none'
		}),
		indicatorsContainer: (provided, state) => ({
		}),
		valueContainer: (provided, state) => ({
			...provided,
			paddingRight: '0px',
			border: 'none',
		}),
		option: (provided, state) => ({
			...provided,
			color:  state.isFocused ? '#5C8DD7' : '#8C8C8C',
			fontFamily: 'Roboto',
			fontWeight: '400',
			fontSize: '20px',
			background: state.isFocused ? '#F5F5F5' : '#FFFFFF',
			width: 'auto',
			cursor: 'pointer'
		})
	}

  	const dropdownOptions = [{label:"Just a thought", value:0}, {label:"Action Item", value: 1}];
  	const defaultOption = dropdownOptions[this.props.defaultCategory];

  	return (
  		<Select options={dropdownOptions} value={defaultOption} styles={customStyles} isSearchable={false} onChange={this.props.updateCategory}/>
  		);
  }
}
export default CategoryComponent;