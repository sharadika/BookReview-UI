import axios from "axios";

//const API_URL = "http://localhost:5299/api";
const API_URL = process.env.REACT_APP_API_URL;

export const WEB_API_URL = API_URL;
export const getGenres = () => axios.get(`${API_URL}/Genre/GetGenres`);
export const getAuthors = () => axios.get(`${API_URL}/Author/GetAuthors`);
export const getPublishers = () => axios.get(`${API_URL}/Publisher/GetPublishers`);
//export const getBooks = () => axios.get(`${API_URL}/Book/GetBooks`);
// export const getBooksPaged = (pageNumber = 1, pageSize = 20) => {
//   return axios.get(`${API_URL}/Book/GetBooks?pageNumber=${pageNumber}&pageSize=${pageSize}`);
// };
export const getBooksPaged = (pageNumber = 1, pageSize = 20, searchTerm = "") => {
  return axios.get(`${API_URL}/Book/GetBooks`, {
    params: {
      pageNumber,
      pageSize,
      searchTerm
    }
  });
};
export const deleteBook = (id) => axios.delete(`${API_URL}/Book/${id}`);
export const updateBook = (id, formData) =>
  axios.put(`${API_URL}/Book/UpdateBook/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getBookById = (id) => {
  return axios.get(`${API_URL}/Book/${id}`);
};
export const addBook = (bookData) =>
  axios.post(`${API_URL}/Book/AddBook`, bookData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
//   export const filterBooks = (genreId, authorId, publisherId) => {
//   let url = `${API_URL}/Book/FilterBooks?`;

//   if (genreId) url += `genreId=${genreId}&`;
//   if (authorId) url += `authorId=${authorId}&`;
//   if (publisherId) url += `publisherId=${publisherId}&`;

//   return axios.get(url);
// };
export const filterBooks = (genreId, authorId, publisherId, pageNumber = 1, pageSize = 20) => {
  let url = `${API_URL}/Book/FilterBooks?`;

  if (genreId) url += `genreId=${genreId}&`;
  if (authorId) url += `authorId=${authorId}&`;
  if (publisherId) url += `publisherId=${publisherId}&`;

  // Add pagination parameters
  url += `pageNumber=${pageNumber}&pageSize=${pageSize}`;

  return axios.get(url);
};
