import React from 'react';
const Modal=(props)=>{
	return (
		<div className="modal-wrapper">
				<div className="modal">
					你需要先停止时钟，才能调整时长
					<button className="modal-closer" onClick={props.closeModal}>X</button>
				</div>
		</div>
		);
}
export default Modal;