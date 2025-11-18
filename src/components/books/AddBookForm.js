import React, { useState, useEffect } from "react";
import "./AddBookForm.css";
import backgroundImage from "../../assets/add-book-bg.jpg";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getGenres, getPublishers, addBook } from "../../services/BookService";

const AddBookForm = ({ onCancel, onSave }) => {
  const initialFormState = {
    bookName: "",
    isbn: "",
    authorFirstName: "",
    authorLastName: "",
    genre: "",
    publisher: "",
    isTranslated: false,
    translator: "",
    image: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [genreOptions, setGenreOptions] = useState([]);
  const [publisherOptions, setPublisherOptions] = useState([]);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [genresRes, publishersRes] = await Promise.all([
          getGenres(),
          getPublishers(),
        ]);

        setGenreOptions(
          genresRes.data.map((g) => ({ value: g.id, label: g.genreName }))
        );
        setPublisherOptions(
          publishersRes.data.map((p) => ({
            value: p.id,
            label: p.publisherName,
          }))
        );
      } catch (err) {
        console.error("Failed to load dropdowns:", err);
        toast.error("⚠️ Failed to load dropdown data");
      }
    };

    loadDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
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

      console.log("Sending:", [...formDataToSend.entries()]);

      const response = await addBook(formDataToSend);
      console.log("Book added:", response.data);

      toast.success("📚 Book added successfully!", {
        position: "top-right",
        autoClose: 2500,
      });

      // ✅ Clear all fields after success
      setFormData(initialFormState);

      // ✅ Reset file input manually
      const fileInput = document.querySelector('input[name="image"]');
      if (fileInput) fileInput.value = "";

      if (onSave) onSave(response.data);
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("❌ Failed to add book!", {
        position: "top-right",
        autoClose: 2500,
      });
    }
  };

  return (
    <div
      className="add-book-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="add-book-form">
        <h2>Add New Book</h2>
        <form onSubmit={handleSubmit}>
          {/* Book name and ISBN */}
          <div className="form-group">
            <label>Book Name</label>
            <input
              type="text"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              placeholder="Enter book name"
              required
            />
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN"
              required
            />
          </div>

          {/* Author names side by side */}
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
                value={
                  genreOptions.find(
                    (opt) => opt.value === formData.genre
                  ) || null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    genre: selected?.value || "",
                  }))
                }
                placeholder="Select Genre"
                isSearchable
                menuPlacement="auto"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>

            <div className="form-group half">
              <label>Publisher</label>
              <Select
                options={publisherOptions}
                value={
                  publisherOptions.find(
                    (opt) => opt.value === formData.publisher
                  ) || null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    publisher: selected?.value || "",
                  }))
                }
                placeholder="Select Publisher"
                isSearchable
                menuPlacement="auto"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
          </div>

          {/* Is Translated */}
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

          {/* Image Upload */}
          <div className="form-group">
            <label>Upload Book Image</label>
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
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Toast container for alerts */}
      <ToastContainer />
    </div>
  );
};

export default AddBookForm;
