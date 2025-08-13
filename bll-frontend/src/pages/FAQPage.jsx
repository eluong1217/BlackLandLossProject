import React from "react";
import "../styles/PageStyles.css";
import FAQItem from "../components/FAQItem";

const FAQPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">FAQ</h1>
        
        <div className="faq-section">
          <FAQItem 
            question="What time period does this data cover?"
            answer="The dataset covers the period from 1920 to 1997, providing nearly eight decades of historical data on Black-owned farmland in the United States."
          />
          <FAQItem 
            question="Filler Question?"
            answer="Filler Answer."
          />
        </div>
        
      </div>
    </div>
  );
};

export default FAQPage;
