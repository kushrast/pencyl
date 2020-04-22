import React, { Component } from 'react';
import Modal from 'react-modal';

class DeleteModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
    };
    
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.deleteThought = this.deleteThought.bind(this);
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
    this.props.returnFocus();
  }

  deleteThought () {
    this.props.deleteThought();
    this.props.handleCloseModal();
  }

  render() {
  	return (
  		<div className="thought-delete">
	  		{this.props.hasTypedInfo ? <div className="thought-delete-enabled pointer" onClick={this.handleOpenModal}>Delete</div> : <div className="thought-delete-disabled">Delete</div>}
	        <Modal 
	           isOpen={this.state.showModal}
             onRequestClose={this.handleCloseModal}
	           contentLabel="Minimal Modal Example"
	           className="thought-delete-modal-container"
	           overlayClassName="thought-delete-overlay"
	           shouldCloseOnEsc={true}
	           shouldCloseOnOverlayClick={true}
             shouldReturnFocusAfterClose={true}
	        >
            <div className="thought-delete-modal">
	        	  <div className="thought-delete-modal-title">Are you sure you want to let go of this thought?</div>
	        	  <div className="thought-delete-modal-content">
                <img src="/img/trashcan.svg" className="thought-delete-trash-can"/>
                <div className="thought-delete-modal-subtitle">
                  If you delete this thought, you won’t be able to access it again. 
                </div>
              </div>
              <div className="thought-delete-modal-buttons">
                <div className="thought-delete-cancel pointer" onClick={this.handleCloseModal}>Cancel</div>
                <div className="thought-delete-separator"></div>
                <div className="thought-delete-confirm pointer" onClick={this.deleteThought}>Yes, Delete it</div>
              </div>
	        	</div>
	        </Modal>
        </div>
  		);
  }
}

export default DeleteModal;