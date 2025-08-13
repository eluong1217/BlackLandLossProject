import React from "react";
import "./styles.css";

const Title = () => {
  return (
    <div className="title-section">
      <h1 className="main-header">How Much Land Have Black Landowners Lost?</h1>
      <p className="explanation-text">
        Select a state on the map, choose a county, and adjust the time range to view detailed 
        land ownership change data for that area.
      </p>
    </div>
  );
};

export default Title;
