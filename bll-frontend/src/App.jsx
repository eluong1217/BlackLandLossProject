import { useState, useEffect } from "react";
import "./App.css";
import DataForm from "./components/DataForm";
import USMap from "./components/USMap";

function App() {
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
      <h1 className="main-header">Black Land Loss Website</h1>
      <p className="main-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. At nulla id veniam ratione, necessitatibus eligendi voluptates fugiat ea iste harum pariatur laboriosam in omnis ducimus minima molestiae? Nisi, soluta dolorum?</p>
      <p className="explanation-text">This website is a work in progress. It will eventually allow users to select a state and county, and view land loss data for that area.</p>
      <div className="app-container">
        <USMap selectedState={selectedState} setSelectedState={setSelectedState} statesAndCounties={statesAndCounties} />
        <DataForm selectedState={selectedState} setSelectedState={setSelectedState} statesAndCounties={statesAndCounties} />
      </div>
    </div>
  );
}

export default App;
