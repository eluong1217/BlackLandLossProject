import React from "react";
import "./styles.css";

const Title = () => {
  return (
    <div className="title-section">
      <h1 className="main-header">How Much Land Have Black Landowners Lost?</h1>
      <p className="main-text">
        Based off of <a href="https://www.aeaweb.org/articles?id=10.1257/pandp.20221015" target="_blank" rel="noopener noreferrer">Professor Dania's Research</a>, visualize the historical decline of Black-owned farmland in the United States from 1920 to 1997. 
        This interactive websites helps calculate the significant decline in Black land ownership and the regional patterns of land loss over nearly eight decades.
      </p>

      <p className="explanation-text">
        Select a state on the map, choose a county, and adjust the time range to view detailed 
        land ownership change data for that area.
      </p>
    </div>
  );
};

export default Title;
