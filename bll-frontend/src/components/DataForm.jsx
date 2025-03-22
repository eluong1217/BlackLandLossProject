import { useState, useEffect, useMemo } from "react";
import "./styles.css";

const DataForm = ({ selectedState, statesAndCounties }) => {
  const allowedYears = useMemo(() => [
    1920, 1925, 1930, 1935, 1940, 1945, 1950, 1954, 1959,
    1964, 1969, 1974, 1978, 1982, 1987, 1992, 1997
  ], []);

  const statesMap = {
    11: "DELAWARE",
    34: "MISSOURI",
    40: "VIRGINIA",
    41: 'ALABAMA',
    42: 'ARKANSAS',
    43: 'FLORIDA',
    44: 'GEORGIA',
    45: 'LOUISIANA',
    46: 'MISSISSIPPI',
    47: 'NORTH CAROLINA',
    48: 'SOUTH CAROLINA',
    49: 'TEXAS',
    51: 'KENTUCKY',
    52: 'MARYLAND',
    53: 'OKLAHOMA',
    54: 'TENNESSEE',
    56: 'WEST VIRGINIA'
  }

  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(allowedYears[0]);
  const [selectedEndDate, setSelectedEndDate] = useState(allowedYears[allowedYears.length - 1]);
  const [counties, setCounties] = useState([]);
  const [landData, setLandData] = useState("");

  // ✅ Fixed list of years for the slider


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
  }, [allowedYears, selectedState, statesAndCounties]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log({
          year1: selectedStartDate,
          year2: selectedEndDate,
          state: selectedState,
          name: selectedCounty === "" ? statesMap[selectedState] : selectedCounty.toUpperCase()
        })
        const response = await fetch('http://127.0.0.1:5000/get-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({
            year1: selectedStartDate,
            year2: selectedEndDate,
            state: selectedState,
            name: selectedCounty === "" ? statesMap[selectedState] : selectedCounty.toUpperCase()
          }),
        });


        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLandData(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedStartDate, selectedEndDate, selectedState, selectedCounty]);

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
      <div className="map-data">
        {allowedYears.length > 0 && (
          <div className="dual-slider-container">
            <label>Selected Range: {selectedStartDate} → {selectedEndDate}</label>
            <div className="slider-wrapper">
              <input
                type="range"
                min={0}
                max={allowedYears.length - 1}
                value={getYearIndex(selectedStartDate)}
                onChange={handleStartDateChange}
                step="1"
                className="date-slider"
              />
              <input
                type="range"
                min={0}
                max={allowedYears.length - 1}
                value={getYearIndex(selectedEndDate)}
                onChange={handleEndDateChange}
                step="1"
                className="date-slider"
              />
              <div
                className="slider-fill"
                style={{
                  left: `${(getYearIndex(selectedStartDate) / (allowedYears.length - 1)) * 100}%`,
                  right: `${100 - (getYearIndex(selectedEndDate) / (allowedYears.length - 1)) * 100}%`,
                }}
              />
            </div>
            <div className="year-labels">
              {allowedYears.map((year, index) => (
                <span key={index} style={{ left: `${(index / (allowedYears.length - 1)) * 100}%` }}>
                  {year}
                </span>
              ))}
            </div>
          </div>
        )}
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

      {selectedState && landData && (
        <div className="state-county-data">
          <h3>Land Data for {landData.name || 'Selected Area'}</h3>

          {landData.total_land_change_percentage !== undefined && (
            <>
              <h4>Land Change</h4>
              <p>Total land change 1920-1997: {landData.total_land_change_percentage}%</p>
              <p>Land change between {selectedStartDate}-{selectedEndDate}: {landData.land_change_percentage}%</p>
            </>
          )}

          {landData.value_change && (
            <>
              <h4>Value Change</h4>
              <p>Average value in first year: ${landData.value_change.year1}</p>
              <p>Average value in second year: ${landData.value_change.year2}</p>
            </>
          )}

          {landData.land_value_range && (
            <>
              <h4>Land Value (per acre)</h4>
              <p>First year: ${landData.land_value_range.year1?.highest}</p>
              <p>Second year: ${landData.land_value_range.year2?.highest}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DataForm;
