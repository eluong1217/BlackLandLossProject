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
    <div className="app-container">
      <USMap selectedState={selectedState} setSelectedState={setSelectedState} statesAndCounties={statesAndCounties} />
      <DataForm selectedState={selectedState} setSelectedState={setSelectedState} statesAndCounties={statesAndCounties} />
    </div>
  );
}

export default App;
