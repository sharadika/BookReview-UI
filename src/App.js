import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import User from './components/users/Users';
import Book from './components/books/Books';
import Review from './components/reviews/Review';
import Footer from "./components/footer/Footer";

function App() {
  return (
    <Router>
      <div className="App">
        <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<User />} />
          <Route path="/books" element={<Book />} />
          <Route path="/reviews" element={<Review />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
