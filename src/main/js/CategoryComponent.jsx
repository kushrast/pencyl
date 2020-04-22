import React, { Component } from 'react';
import Select from 'react-select';
import "./css/CategoryComponent.css";

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
			color: '#8C8C8C',
			fontFamily: 'Roboto',
			fontWeight: '400',
			fontSize: '20px',
			paddingRight: '0px',
			outline: 0
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
			width: 'auto'
		})
	}

  	const dropdownOptions = [{label:"Just a thought"}, {label:"Action Item"}];
  	const defaultOption = dropdownOptions[0];
  	return (
  		<Select options={dropdownOptions} defaultValue={defaultOption} styles={customStyles} isSearchable={false}/>
  		);
  }
}
export default CategoryComponent;