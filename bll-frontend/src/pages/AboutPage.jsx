import React from "react";
import "../styles/PageStyles.css";

const AboutPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">About</h1>

        <p className="main-text">
        Based off of <a href="https://www.aeaweb.org/articles?id=10.1257/pandp.20221015" target="_blank" rel="noopener noreferrer">Professor Dania's Research</a>, visualize the historical decline of Black-owned farmland in the United States from 1920 to 1997. 
        This interactive websites helps calculate the significant decline in Black land ownership and the regional patterns of land loss over nearly eight decades.
        </p>
        
        <p>This is the About page. Add your content here.</p>
        
      </div>
    </div>
  );
};

export default AboutPage;
