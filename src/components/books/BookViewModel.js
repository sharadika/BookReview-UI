import React, { useState, useEffect } from "react";
import { WEB_API_URL } from "../../services/BookService";

import "./BookViewModel.css";
import {
  getBookById,
  getAuthors,
  getGenres,
  getPublishers,
} from "../../services/BookService";

const BookViewModel = ({ isOpen, onClose, bookId }) => {
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookId && isOpen) {
      fetchData();
    }
  }, [bookId, isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch book, authors, genres, and publishers in parallel
      const [bookRes, authorsRes, genresRes, publishersRes] = await Promise.all([
        getBookById(bookId),
        getAuthors(),
        getGenres(),
        getPublishers(),
      ]);

      setBook(bookRes.data);
      setAuthors(authorsRes.data || []);
      setGenres(genresRes.data || []);
      setPublishers(publishersRes.data || []);
    } catch (error) {
      console.error("Error fetching book data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Match names from API lists using IDs
  const author = authors.find((a) => a.id === book?.authorId);
  const genre = genres.find((g) => g.id === book?.genreId);
  const publisher = publishers.find((p) => p.id === book?.publisherId);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{book ? book.title : "Book Details"}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-content" style={{ textAlign: "center" }}>
          {loading ? (
            <p>Loading...</p>
          ) : book ? (
            <>
              <img
                src={`${WEB_API_URL.replace("/api", "")}${book.imageUrl}`} 
                alt={book.title}
                style={{ width: "200px", marginBottom: "15px" }}
              />
              <p>
                <strong>Title:</strong> {book.title}
              </p>
              <p>
                <strong>Author:</strong>{" "}
                {author
                  ? `${author.firstName} ${author.lastName}`
                  : "N/A"}
              </p>
              <p>
                <strong>Translator:</strong> {book.translator || "N/A"}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn || "N/A"}
              </p>
              <p>
                <strong>Genre:</strong> {genre ? genre.genreName : "N/A"}
              </p>
              <p>
                <strong>Publisher:</strong>{" "}
                {publisher ? publisher.publisherName : "N/A"}
              </p>
            </>
          ) : (
            <p>Book not found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookViewModel;
