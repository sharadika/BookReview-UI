import React, { useState, useEffect } from "react";
import "./BookList.css";
import BookViewModel from "./BookViewModel";
import EditBookModal from "./EditBookModel";
import DeleteBookModal from "./BookDeleteModal";
import { getBooksPaged, getAuthors, getGenres, getPublishers, WEB_API_URL } from "../../services/BookService";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useAuthRoles } from "../../auth/hooks/useAuthRoles"; 

const BookList = ({ filteredBooks = [], noResultMessage = "" }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBookId, setEditBookId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [deleteBookName, setDeleteBookName] = useState("");

  const { isAdmin } = useAuthRoles();

  // 🔹 Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPageNumber(1); // Reset to first page on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 🔹 Load books whenever pageNumber or debouncedSearchTerm changes
  useEffect(() => {
    if (filteredBooks.length > 0 || noResultMessage) {
      // Show dropdown search results
      setBooks(filteredBooks);
      setTotalPages(1); // disable pagination for filtered results
      setLoading(false);
    } else {
      // Load default paginated + live search
      loadBooks(pageNumber, debouncedSearchTerm);
    }
  }, [filteredBooks, noResultMessage, pageNumber, debouncedSearchTerm]);

  const loadBooks = async (page, search = "") => {
    try {
      setLoading(true);

      const [bookRes, authorRes, genreRes, publisherRes] = await Promise.all([
        getBooksPaged(page, pageSize, search),
        getAuthors(),
        getGenres(),
        getPublishers(),
      ]);

      const booksData = bookRes.data || [];
      setTotalPages(booksData.length > 0 ? booksData[0].totalPages || 1 : 1);

      const authorsData = authorRes.data || [];
      const genresData = genreRes.data || [];
      const publishersData = publisherRes.data || [];

      const mergedBooks = booksData.map((book) => {
        const author = authorsData.find((a) => a.id === book.authorId);
        const genre = genresData.find((g) => g.id === book.genreId);
        const publisher = publishersData.find((p) => p.id === book.publisherId);

        return {
          ...book,
          authorName: author ? `${author.firstName} ${author.lastName}` : "Unknown Author",
          genreName: genre ? genre.genreName : "Unknown Genre",
          publisherName: publisher ? publisher.publisherName : "Unknown Publisher",
        };
      });

      setBooks(mergedBooks);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleView = (id) => { setSelectedBookId(id); setIsModalOpen(true); };
  const handleEdit = (id) => { setEditBookId(id); setIsEditModalOpen(true); };
  const handleDeleteClick = (book) => { setDeleteBookId(book.id); setDeleteBookName(book.title); setIsDeleteModalOpen(true); };
  const handleDeleteSuccess = () => loadBooks(pageNumber, debouncedSearchTerm);
  const handleUpdateSuccess = () => loadBooks(pageNumber, debouncedSearchTerm);

  // Pagination
  const handlePrev = () => pageNumber > 1 && setPageNumber(pageNumber - 1);
  const handleNext = () => pageNumber < totalPages && setPageNumber(pageNumber + 1);

  return (
    <div className="book-list-container">
      <h1>Book List</h1>

      <input
        type="text"
        placeholder="Search by title, author, genre, publisher"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <div className="loading-container">
          <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." className="loading-image" />
        </div>
      ) : (
        <>
          {noResultMessage && <p className="no-results-message">{noResultMessage}</p>}

          <div className="book-grid">
            {books.map((book) => (
              <div key={book.id} className="book-tile">
                <img src={`${WEB_API_URL.replace("/api", "")}${book.imageUrl}`} alt={book.title} className="book-image" />
                <h3>{book.title}</h3>
                <p>{book.authorName}</p>
                <p>{book.genreName}</p>
                <p>{book.publisherName}</p>
                <div className="book-actions">
                  <button onClick={() => handleView(book.id)} title="View"><FaEye /></button>
                  {isAdmin &&<button onClick={() => handleEdit(book.id)} title="Edit"><FaEdit /></button>}
                  {isAdmin &&<button onClick={() => handleDeleteClick(book)} title="Delete"><FaTrash /></button>}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination only if no filtered results */}
          {!filteredBooks.length && !noResultMessage && (
            <div className="pagination-controls">
              <button className="pagination-btn" onClick={handlePrev} disabled={pageNumber === 1}>◀ Prev</button>
              <span className="page-info">Page {pageNumber} of {totalPages}</span>
              <button className="pagination-btn" onClick={handleNext} disabled={pageNumber === totalPages}>Next ▶</button>
            </div>
          )}
        </>
      )}

      <BookViewModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} bookId={selectedBookId} />
      <EditBookModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} bookId={editBookId} onUpdated={handleUpdateSuccess} />
      <DeleteBookModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} bookName={deleteBookName} bookId={deleteBookId} onDeleted={handleDeleteSuccess} />
    </div>
  );
};

export default BookList;
