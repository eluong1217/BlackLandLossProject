import { useState, useEffect } from "react";
import DataForm from "../components/DataForm";
import USMap from "../components/USMap";
import Title from "../components/Title";

const HomePage = () => {
  const baseUrl =
    import.meta.env.MODE === "development"
      ? "http://127.0.0.1:5000/"
      : import.meta.env.VITE_BACKEND_URL;

  const [selectedState, setSelectedState] = useState("");
  const [statesAndCounties, setStatesAndCounties] = useState([]);

  useEffect(() => {
    const fetchStatesAndCounties = async () => {
      try {
        const response = await fetch(`${baseUrl}/get_states_and_counties`);
        const data = await response.json();
        setStatesAndCounties(data);
      } catch (error) {
        console.error("Error fetching states and counties:", error);
      }
    };

    fetchStatesAndCounties();
  }, []);

  return (
    <div>
      <h1 className="mobile-title">Black Land Loss</h1>
      
      {/* Mobile message */}
      <div className="mobile-message">
        <h2>Hi! Sorry for the inconvenience, but unfortunately the mobile version of this page is still in progress. Check this website out on the computer for the best results.</h2>
      </div>

      {/* Desktop layout */}
      <Title />
      <div className="app-container">
        <USMap selectedState={selectedState} setSelectedState={setSelectedState} statesAndCounties={statesAndCounties} />
        <DataForm selectedState={selectedState} setSelectedState={setSelectedState} statesAndCounties={statesAndCounties} />
      </div>
    </div>
  );
};

export default HomePage;
