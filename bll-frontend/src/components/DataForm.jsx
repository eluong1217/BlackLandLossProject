import { useState, useEffect } from 'react';

const DataForm = () => {
  const [statesAndCounties, setStatesAndCounties] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [dates, setDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [counties, setCounties] = useState([]);

  // useEffect, useState, and useCallback are hooks that allow you to use state and other React features without writing a class.

  // Fetch the states and counties data when the component mounts
  useEffect(() => {
    const fetchStatesAndCounties = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_states_and_counties');
        const data = await response.json();
        setStatesAndCounties(data);
        setDates(data[0].dates)
        setFilteredDates(data[0].dates)
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

  const handleStartDateChange = (event) => {
    setFilteredDates([...dates])
    setSelectedStartDate(event.target.value);
  }

  const handleEndDateChange = (event) => {
    setSelectedEndDate(event.target.value);
  }

  useEffect(() => {
    try {
      setFilteredDates([...dates].filter(date => date >= selectedStartDate))
    } catch (error) {
      console.error('Error filtering dates:', error);
    }
  },[selectedStartDate])

  return (
    <div>
      <form>
        <div>
          <label>State:</label>
          <select value={selectedState} onChange={handleStateChange} >
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
            <select value={selectedCounty} onChange={handleCountyChange} >
              <option value="">Select County</option>
              {counties.map((county, index) => (
                <option key={index} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
        )}

       {selectedCounty && (
          <div>
            <label>Dates:</label>
            <select value={selectedStartDate} onChange={handleStartDateChange}>
              <option value="">Select start date</option>
              {dates.map((dates,index) => (
                <option key={index} value={dates}>
                  {dates}
                </option>
              ))}
            </select>
            <select value={selectedEndDate} onChange={handleEndDateChange}>
              <option value="">Select end date</option>
              {filteredDates.map((dates,index) => (
                <option key={index} value={dates}>
                  {dates}
                </option>
              ))}
            </select>
          </div>
        )}
      </form>

      <div>
        {selectedState && selectedCounty && selectedStartDate && selectedEndDate && (
          <div>
            <p>Selected State: {selectedState}</p>
            <p>Selected County: {selectedCounty}</p>
            <p>Selected Dates: {selectedStartDate} &#8594; {selectedEndDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataForm;
