import React from "react";
import "../styles/DeleteConfirmModal.css";

function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>정말 삭제하시겠습니까?</h3>
                <p>이 작업은 되돌릴 수 없습니다.</p>
                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>취소</button>
                    <button className="confirm-button" onClick={onConfirm}>삭제</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
