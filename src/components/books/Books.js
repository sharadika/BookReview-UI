import React, { useState, useEffect } from "react";
import "./Books.css";
import {
  getGenres,
  getAuthors,
  getPublishers,
  filterBooks,
} from "../../services/BookService";
import AddBookForm from "./AddBookForm";
import BookList from "./BookList";

const Books = () => {
  const [filters, setFilters] = useState({
    genre: "",
    author: "",
    publisher: "",
    rating: "",
    sort: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered results
  const [noResultMessage, setNoResultMessage] = useState(""); // Message from API

  // Load dropdowns
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [genreRes, authorRes, publisherRes] = await Promise.all([
          getGenres(),
          getAuthors(),
          getPublishers(),
        ]);
        setGenres(genreRes.data);
        setAuthors(authorRes.data);
        setPublishers(publisherRes.data);
      } catch (err) {
        console.error("Failed to load dropdown data:", err);
      }
    };
    loadDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Search filtered books
  const handleSearch = async () => {
    try {
      const genreId = filters.genre ? parseInt(filters.genre) : null;
      const authorId = filters.author ? parseInt(filters.author) : null;
      const publisherId = filters.publisher ? parseInt(filters.publisher) : null;

      const response = await filterBooks(genreId, authorId, publisherId);

      if (!response.data || response.data.length === 0) {   
      setFilteredBooks([]);
      setNoResultMessage("Result not found");           
    } else {
      setFilteredBooks(response.data);
      setNoResultMessage(""); 
    }
    } catch (error) {
      console.error("Error fetching filtered books:", error);
    }
  };

  const handleClear = () => {
    setFilters({
      genre: "",
      author: "",
      publisher: "",
      rating: "",
      sort: "",
    });
    setFilteredBooks([]);
    setNoResultMessage("");
  };

  return (
    <div className="books-container">
      <div className="filter-panel">
        <button className="add-book-btn" onClick={() => setShowForm(true)}>
          Add New Book
        </button>
        <h3>Filters</h3>

        {/* Genre */}
        <div className="filter-group">
          <label className="label-name">Genre</label>
          <select name="genre" value={filters.genre} onChange={handleChange}>
            <option value="">All</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.genreName}
              </option>
            ))}
          </select>
        </div>

        {/* Author */}
        <div className="filter-group">
          <label className="label-name">Author</label>
          <select name="author" value={filters.author} onChange={handleChange}>
            <option value="">All</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Publisher */}
        <div className="filter-group">
          <label className="label-name">Publisher</label>
          <select
            name="publisher"
            value={filters.publisher}
            onChange={handleChange}
          >
            <option value="">All</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.publisherName}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Book List / Add Book Form */}
      <div className="book-list">
        {showForm ? (
          <AddBookForm onCancel={() => setShowForm(false)} />
        ) : (
          <BookList filteredBooks={filteredBooks} noResultMessage={noResultMessage} />
        )}
      </div>
    </div>
  );
};

export default Books;
