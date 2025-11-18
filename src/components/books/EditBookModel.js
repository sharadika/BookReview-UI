import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./EditBookModel.css";
import { getGenres, getPublishers, getAuthors, getBookById, updateBook } from "../../services/BookService";

const EditBookModal = ({ bookId, isOpen, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    bookName: "",
    isbn: "",
    authorFirstName: "",
    authorLastName: "",
    genre: "",
    publisher: "",
    isTranslated: false,
    translator: "",
    image: null,
    existingImageUrl: "",
  });

  const [genreOptions, setGenreOptions] = useState([]);
  const [publisherOptions, setPublisherOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && bookId) {
      loadData();
    }
  }, [isOpen, bookId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [genresRes, publishersRes, authorsRes, bookRes] = await Promise.all([
        getGenres(),
        getPublishers(),
        getAuthors(),
        getBookById(bookId),
      ]);

      setGenreOptions(
        genresRes.data.map((g) => ({ value: g.id, label: g.genreName }))
      );
      setPublisherOptions(
        publishersRes.data.map((p) => ({ value: p.id, label: p.publisherName }))
      );

      const authors = authorsRes.data || [];
      const book = bookRes.data;

      const author = authors.find((a) => a.id === book.authorId);

       let imageUrl = "";
    //   if (book.imagePath) {
    //     const baseUrl = process.env.REACT_APP_API_URL || "https://localhost:7019";
    //     imageUrl = book.imagePath.startsWith("http")
    //       ? book.imagePath
    //       : `${baseUrl}${book.imagePath.startsWith("/") ? "" : "/"}${book.imagePath}`;
    //   }

      setFormData({
        bookName: book.title,
        isbn: book.isbn,
        authorFirstName: author ? author.firstName : "",
        authorLastName: author ? author.lastName : "",
        genre: book.genreId,
        publisher: book.publisherId,
        isTranslated: book.isTranslated,
        translator: book.translator || "",
        image: null,
        existingImageUrl: imageUrl,
      });
    } catch (err) {
      console.error("Error loading edit data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Id", bookId);
      formDataToSend.append("Title", formData.bookName);
      formDataToSend.append("FirstName", formData.authorFirstName);
      formDataToSend.append("LastName", formData.authorLastName);
      formDataToSend.append("ISBN", formData.isbn);
      formDataToSend.append("GenreId", formData.genre);
      formDataToSend.append("PublisherId", formData.publisher);
      formDataToSend.append("IsTranslated", formData.isTranslated);
      formDataToSend.append("Translator", formData.translator || "");

      if (formData.image) {
        formDataToSend.append("Image", formData.image);
      }

      await updateBook(bookId, formDataToSend);

      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Failed to update book!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>Edit Book</h2>
            <form onSubmit={handleSubmit}>
              {/* Book Name */}
              <div className="form-group">
                <label>Book Name</label>
                <input
                  type="text"
                  name="bookName"
                  value={formData.bookName}
                  onChange={handleChange}
                  placeholder="Enter book name"
                />
              </div>

              {/* ISBN */}
              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Enter ISBN"
                />
              </div>

              {/* Author names */}
              <div className="form-row">
                <div className="form-group half">
                  <label>Author First Name</label>
                  <input
                    type="text"
                    name="authorFirstName"
                    value={formData.authorFirstName}
                    onChange={handleChange}
                    placeholder="First name"
                  />
                </div>

                <div className="form-group half">
                  <label>Author Last Name</label>
                  <input
                    type="text"
                    name="authorLastName"
                    value={formData.authorLastName}
                    onChange={handleChange}
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Genre & Publisher */}
              <div className="form-row">
                <div className="form-group half">
                  <label>Genre</label>
                  <Select
                    options={genreOptions}
                    value={genreOptions.find((opt) => opt.value === formData.genre) || null}
                    onChange={(selected) =>
                      setFormData((prev) => ({ ...prev, genre: selected?.value || "" }))
                    }
                    placeholder="Select Genre"
                    isSearchable
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>

                <div className="form-group half">
                  <label>Publisher</label>
                  <Select
                    options={publisherOptions}
                    value={publisherOptions.find((opt) => opt.value === formData.publisher) || null}
                    onChange={(selected) =>
                      setFormData((prev) => ({ ...prev, publisher: selected?.value || "" }))
                    }
                    placeholder="Select Publisher"
                    isSearchable
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>
              </div>

              {/* Translated */}
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="isTranslated"
                  checked={formData.isTranslated}
                  onChange={handleChange}
                />
                <label>Is Translated?</label>
              </div>

              {formData.isTranslated && (
                <div className="form-group">
                  <label>Translator Name</label>
                  <input
                    type="text"
                    name="translator"
                    value={formData.translator}
                    onChange={handleChange}
                    placeholder="Enter translator name"
                  />
                </div>
              )}

              {/* Image */}
              <div className="form-group">
                <label>Book Image</label>
                {formData.existingImageUrl && (
                  <div className="image-preview">
                    <img
                      src={formData.existingImageUrl}
                      alt="Book"
                      style={{
                        width: "120px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        marginBottom: "8px",
                      }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              {/* Buttons */}
              <div className="button-group">
                <button type="submit" className="save-btn">
                  Update
                </button>
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditBookModal;
