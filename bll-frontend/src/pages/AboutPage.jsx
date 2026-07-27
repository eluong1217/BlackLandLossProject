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
        
        <p className="main-text"> At the end of the Civil War, Black families owned almost no land but demonstrated an almost universal desire to obtain it. By 1910, African Americans acquired more than 16 million acres. This, however, would be the peak of Black farmland ownership in the United States as the 20th century oversaw the rapid dispossession of Black-owned agricultural acreage</p>
        <p className="main-text">In addition to theft by state-sanctioned violence, intimidation, and lynching, Black farmers also lost land due to discrimination by banks and financial institutions; through the denial of access to federal farm benefits by local administrators who funneled those benefits to white farm owners; through forced partition sales brought about by predatory third parties; through government misuse of eminent domain, including many cases in which Black landowners were compensated well below market value; through discriminatory tax assessments and non-competitive tax sales; and through longstanding, coordinated discrimination by USDA agents who wield power and control over access to credit and essential resources.</p>
        <p className="main-text">By 1997, Black farmers lost more than 90 percent of the 16 million acres they owned in 1910.</p>
        <p className="main-text">Research from the Land Loss and Reparations Project helps visualize the historical decline of Black-owned farmland in the United States from 1920 to 1997. Using Census of Agriculture data, this interactive website helps calculate the significant decline in Black land ownership and the regional patterns of land loss over nearly eight decades. </p>
      
      </div>
    </div>
  );
};

export default AboutPage;
