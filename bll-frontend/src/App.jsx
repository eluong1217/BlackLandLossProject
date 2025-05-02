import { useState, useEffect } from "react";
import "./App.css";
import DataForm from "./components/DataForm";
import USMap from "./components/USMap";

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [statesAndCounties, setStatesAndCounties] = useState([]);

  useEffect(() => {
    const fetchStatesAndCounties = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/get_states_and_counties");
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
      <h1 className="main-header">Test Header</h1>
      <p className="main-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. At nulla id veniam ratione, necessitatibus eligendi voluptates fugiat ea iste harum pariatur laboriosam in omnis ducimus minima molestiae? Nisi, soluta dolorum?</p>
      <div className="app-container">
        <USMap selectedState={selectedState} setSelectedState={setSelectedState} statesAndCounties={statesAndCounties} />
        <DataForm selectedState={selectedState} setSelectedState={setSelectedState} statesAndCounties={statesAndCounties} />
      </div>
    </div>
  );
}

export default App;
