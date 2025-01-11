import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Footer from './Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom'; // Add this import


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Company1 from '../Assets/Company 1.jpg';
import Company2 from '../Assets/Company 2.jpg';
import Company3 from '../Assets/Company 3.jpg';
import Company4 from '../Assets/Company 4.jpg';
import Company5 from '../Assets/Company 5.jpg';

function WelcomePage() {
  const navigate = useNavigate(); // Create navigate function

  // Function to handle the view more button click
  const handleViewMore = (company) => {
    navigate(`/company/${company}`); // Navigate to the company details page
  };

  return (
    <div className="welcome-container">
      <header className="navbar">
        <h1>Vehicle Insurance Co.</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
          <Link to="/signup">
            <button className="signup-button">Signup</button>
          </Link>
        </ul>
      </header>
      
      <main>
        <div className='welcome-text'>
          <h1>Welcome to Vehicle Insurance Co.</h1>
          <p>Your trusted partner for comprehensive vehicle insurance plans.</p>
        </div>

        <section className='plans-section'>
          <h2>Choose your Insurance Partner</h2>
          <Swiper
            className='swiper'
            loop={true}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={0}
            breakpoints={{
              320: { slidesPerView: 1 },
              410: { slidesPerView: 2 },
              734: { slidesPerView: 3 },
              1100: { slidesPerView: 4 },
            }}
            navigation
          >
            {/* SwiperSlide items */}
            {[
              { name: 'Company 1', image: Company1 },
              { name: 'Company 2', image: Company2 },
              { name: 'Company 3', image: Company3 },
              { name: 'Company 4', image: Company4 },
              { name: 'Company 5', image: Company5 }
            ].map((company, index) => (
              <SwiperSlide key={index}>
                <div className='slide-container'>
                  <img src={company.image} alt={company.name} />
                  <h3>{company.name}</h3>
                  <p>{company.name} offers reliable and customizable insurance plans.</p>
                  <button onClick={() => handleViewMore(company.name)}>View More</button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className="features-section">
          <div className="feature">
            <h3>Comprehensive Coverage</h3>
            <p>Covering accidents, theft, and more to keep you protected.</p>
          </div>
          <div className="feature">
            <h3>24/7 Customer Support</h3>
            <p>Always here to help you with claims and questions.</p>
          </div>
          <div className="feature">
            <h3>Easy Claims Process</h3>
            <p>Hassle-free claims to get you back on the road quickly.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default WelcomePage;
