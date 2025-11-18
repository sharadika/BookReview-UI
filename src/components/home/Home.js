import React from "react";
import "./Home.css";
import homeBg from "../../assets/home-image-bg.png";
import bookImg from "../../assets/book.png";
import reviewImg from "../../assets/review.png";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
   const navigate = useNavigate();

  return (
    <>
    <header
      className="home-content"
      style={{
        backgroundImage: `url(${homeBg})`,
      }}>
    </header>
    
     <div className="btn-container">
        <div className="tile" onClick={() => navigate("/books")}>
          <img src={bookImg} alt="Books" />
          <button onClick={() => navigate("/books")}>Book</button> 
        </div>

        <div className="tile" onClick={() => navigate("/reviews")}>
          <img src={reviewImg} alt="Reviews" />
          <button onClick={() => navigate("/reviews")}>Review</button>
        </div>
      </div>
    </>
  );
};

export default Home;
