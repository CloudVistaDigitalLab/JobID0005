import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Company1 from '../Assets/Company 1.png';
import Company2 from '../Assets/Company 2.png';
import Company3 from '../Assets/Company 3.png';
import Company4 from '../Assets/Company 4.png';
import Company5 from '../Assets/Company 5.png';

const companyPlans = {
  "Company 1": {
    name: "Sri Lanka Insurance Corporation (SLIC)",
    price: "Rs19900/month",
    amount: 19900,
    details: "Comprehensive coverage with roadside assistance. Includes collision, theft, fire, and vandalism protection. 24/7 customer support and access to over 1,000 repair shops nationwide. Additional discounts for safe driving and bundling multiple policies."
  },
  "Company 2": {
    name: "Allianz Insurance Lanka",
    price: "Rs14900/month",
    amount: 14900,
    details: "Affordable plan with accident coverage. Offers protection for medical bills, vehicle repairs, and lost wages in case of an accident. Includes free accident forgiveness and a rental car option while your vehicle is being repaired."
  },
  "Company 3": {
    name: "AIA Insurance",
    price: "Rs17900/month",
    amount: 17900,
    details: "Flexible options for occasional drivers. Pay-per-mile coverage option for those who drive less than 10,000 miles per year. Includes optional coverage for roadside assistance, rental reimbursement, and personal injury protection."
  },
  "Company 4": {
    name: "Cooperative Insurance",
    price: "Rs21900/month",
    amount: 21900,
    details: "Premium coverage for full protection. Covers everything from natural disasters to comprehensive liability. Includes free windshield repair, guaranteed new car replacement, and a 5-star claims service experience. Priority customer support with a dedicated agent."
  },
  "Company 5": {
    name: "Janashakthi Insurance",
    price: "Rs12900/month",
    amount: 12900,
    details: "Basic coverage for everyday drivers. Includes protection against liability, collision, and comprehensive damage. Ideal for drivers who need essential coverage with no-frills. Special discounts for students, seniors, and military personnel."
  },
};

function WelcomePage() {
  const navigate = useNavigate();

  const handleViewMore = (company) => {
    navigate(`/company/${company}`, { state: companyPlans[company] });
  };

  return (
    <div className="welcome-container">
      <Box sx={{ mt: 10 }} />
      <div className="welcome-text">
        <h1>Welcome to Vehicle Insurance Co.</h1>
        <p>Your trusted partner for comprehensive vehicle insurance plans.</p>
      </div>

      <section className="plans-section">
        <h2>Choose your Insurance Partner</h2>
        <Swiper
          loop={true}
          autoplay={{
            delay: 2500,
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
          {[{ name: 'Sri Lanka Insurance Corporation (SLIC)', image: Company1, details: "Comprehensive coverage with roadside assistance. Includes collision, theft, fire, and vandalism protection. 24/7 customer support and access to over 1,000 repair shops nationwide. Additional discounts for safe driving and bundling multiple policies." },
          { name: 'Allianz Insurance Lanka', image: Company2, details: "Affordable plan with accident coverage. Offers protection for medical bills, vehicle repairs, and lost wages in case of an accident. Includes free accident forgiveness and a rental car option while your vehicle is being repaired." },
          { name: 'AIA Insurance', image: Company3, details: "Flexible options for occasional drivers. Pay-per-mile coverage option for those who drive less than 10,000 miles per year. Includes optional coverage for roadside assistance, rental reimbursement, and personal injury protection." },
          { name: 'Cooperative Insurance', image: Company4, details: "Premium coverage for full protection. Covers everything from natural disasters to comprehensive liability. Includes free windshield repair, guaranteed new car replacement, and a 5-star claims service experience. Priority customer support with a dedicated agent." },
          { name: 'Janashakthi Insurance', image: Company5, details: "Basic coverage for everyday drivers. Includes protection against liability, collision, and comprehensive damage. Ideal for drivers who need essential coverage with no-frills. Special discounts for students, seniors, and military personnel." }].map((company, index) => (
            <SwiperSlide key={index}>
              <div className="slide-container">
                <img src={company.image} alt={company.name} />
                <h3>{company.name}</h3>
                <p>{company.name} {company.details}</p>
                <button onClick={() => handleViewMore(company.name)}>View More</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <Card elevation={3} className="features-section" sx={{ px: 10, gap: 10, borderRadius: 0 }}>
        <Paper sx={{ px: 3, py: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" sx={{ color: '#2a9d8f' }}>Comprehensive Coverage</Typography>
          <Typography variant="body1">Covering accidents, theft, and more to keep you protected.</Typography>
        </Paper>
        <Paper sx={{ px: 3, py: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" sx={{ color: '#2a9d8f' }}>24/7 Customer Support</Typography>
          <Typography variant="body1">Always here to help you with claims and questions.</Typography>
        </Paper>
        <Paper sx={{ px: 3, py: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" sx={{ color: '#2a9d8f' }}>Easy Claims Process</Typography>
          <Typography variant="body1">Hassle-free claims to get you back on the road quickly.</Typography>
        </Paper>
      </Card>
    </div>
  );
}

export default WelcomePage;
