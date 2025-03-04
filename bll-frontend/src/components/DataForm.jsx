import { useState, useEffect } from "react";
import "./styles.css";

const DataForm = ({ selectedState, setSelectedState, statesAndCounties }) => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [counties, setCounties] = useState([]);
  
  // ✅ Fixed list of years for the slider
  const allowedYears = [1920, 1925, 1930, 1935, 1940, 1945, 1950, 1954, 1959, 
                        1964, 1969, 1974, 1978, 1982, 1987, 1992, 1997];

  // Convert years to index positions for the slider
  const getYearIndex = (year) => allowedYears.indexOf(year);
  const getYearFromIndex = (index) => allowedYears[index];

  useEffect(() => {
    if (selectedState) {
      const stateData = statesAndCounties.find((state) => state.state_code === selectedState);

      if (stateData) {
        setCounties(stateData.counties);
        setSelectedStartDate(allowedYears[0]);  // Set default start to first year
        setSelectedEndDate(allowedYears[allowedYears.length - 1]); // Set default end to last year
      } else {
        setCounties([]);
      }
      setSelectedCounty("");
    }
  }, [selectedState, statesAndCounties]);

  // Handle Start Date Change (Snaps to nearest allowed year)
  const handleStartDateChange = (event) => {
    const newIndex = parseInt(event.target.value, 10);
    const newYear = getYearFromIndex(newIndex);

    if (newYear <= selectedEndDate) {
      setSelectedStartDate(newYear);
    }
  };

  // Handle End Date Change (Snaps to nearest allowed year)
  const handleEndDateChange = (event) => {
    const newIndex = parseInt(event.target.value, 10);
    const newYear = getYearFromIndex(newIndex);

    if (newYear >= selectedStartDate) {
      setSelectedEndDate(newYear);
    }
  };

  return (
    <div className="data-form-container">
      <h3>Select a State</h3>
      <form>
        <div>
          <p>{selectedState 
            ? statesAndCounties.find(state => state.state_code === selectedState)?.state_name 
            : "No state selected"}
          </p>
        </div>

        {selectedState && (
          <div className="dropdown-container">
            <label>County:</label>
            <select 
              value={selectedCounty} 
              onChange={(e) => setSelectedCounty(e.target.value)}
            >
              <option value="">Select County</option>
              {counties.map((county, index) => (
                <option key={index} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ✅ Dual-Thumb Date Slider (Only Moves Between Allowed Years) */}
        {selectedCounty && allowedYears.length > 0 && (
          <div className="dual-slider-container">
            <label>Selected Range: {selectedStartDate} → {selectedEndDate}</label>
            <div className="slider-wrapper">
              {/* Start Date Slider */}
              <input
                type="range"
                min={0}
                max={allowedYears.length - 1}
                value={getYearIndex(selectedStartDate)}
                onChange={handleStartDateChange}
                step="1"
                className="date-slider"
              />
              {/* End Date Slider */}
              <input
                type="range"
                min={0}
                max={allowedYears.length - 1}
                value={getYearIndex(selectedEndDate)}
                onChange={handleEndDateChange}
                step="1"
                className="date-slider"
              />
              {/* Background Fill Effect */}
              <div
                className="slider-fill"
                style={{
                  left: `${(getYearIndex(selectedStartDate) / (allowedYears.length - 1)) * 100}%`,
                  right: `${100 - (getYearIndex(selectedEndDate) / (allowedYears.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Year Labels Under Slider */}
            <div className="year-labels">
              {allowedYears.map((year, index) => (
                <span key={index} style={{ left: `${(index / (allowedYears.length - 1)) * 100}%` }}>
                  {year}
                </span>
              ))}
            </div>
          </div>
        )}
      </form>

      <div className="selection-summary">
        {selectedState && selectedCounty && selectedStartDate && selectedEndDate && (
          <div>
            <h4>Selection Summary:</h4>
            <p><strong>State:</strong> {statesAndCounties.find(state => state.state_code === selectedState)?.state_name}</p>
            <p><strong>County:</strong> {selectedCounty}</p>
            <p><strong>Dates:</strong> {selectedStartDate} → {selectedEndDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataForm;
