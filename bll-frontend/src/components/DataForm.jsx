import { useState, useEffect } from 'react';

const DataForm = () => {
  const [statesAndCounties, setStatesAndCounties] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [counties, setCounties] = useState([]);

  // Fetch the states and counties data when the component mounts
  useEffect(() => {
    const fetchStatesAndCounties = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_states_and_counties');
        const data = await response.json();
        setStatesAndCounties(data);
      } catch (error) {
        console.error('Error fetching states and counties:', error);
      }
    };

    fetchStatesAndCounties();
  }, []);

  // Update counties based on the selected state
  const handleStateChange = (event) => {
    const stateCode = event.target.value;
    setSelectedState(stateCode);

    // Find the counties for the selected state
    const stateData = statesAndCounties.find((state) => state.state_code === parseInt(stateCode));
    setCounties(stateData ? stateData.counties : []);
    setSelectedCounty('');
  };

  const handleCountyChange = (event) => {
    setSelectedCounty(event.target.value);
  };

  return (
    <div>
      <form>
        <div>
          <label>State:</label>
          <select value={selectedState} onChange={handleStateChange}>
            <option value="">Select State</option>
            {statesAndCounties.map((state) => (
              <option key={state.state_code} value={state.state_code}>
                {state.state_name}
              </option>
            ))}
          </select>
        </div>

        {selectedState && (
          <div>
            <label>County:</label>
            <select value={selectedCounty} onChange={handleCountyChange}>
              <option value="">Select County</option>
              {counties.map((county, index) => (
                <option key={index} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* You can add other form fields here */}
      </form>

      <div>
        <p>Selected State: {selectedState}</p>
        <p>Selected County: {selectedCounty}</p>
      </div>
    </div>
  );
};

export default DataForm;
