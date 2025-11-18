import React from "react";
import { deleteBook } from "../../services/BookService"; // adjust path if needed
import "./BookDeleteModal.css";

const BookDeleteModal = ({ isOpen, onClose, bookName, bookId, onDeleted }) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await deleteBook(bookId); // call your API function
      onDeleted(bookId);        // notify parent to refresh list
      onClose();                // close modal
    } catch (error) {
      console.error(error);
      alert("Failed to delete the book.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to delete "{bookName}"?</h3>
        <div className="modal-buttons">
          <button className="btn btn-danger" onClick={handleDelete}>
            Yes
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDeleteModal;
