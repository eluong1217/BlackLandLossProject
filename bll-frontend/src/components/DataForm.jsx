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
  };

  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(allowedYears[0]);
  const [selectedEndDate, setSelectedEndDate] = useState(allowedYears[allowedYears.length - 1]);
  const [counties, setCounties] = useState([]);
  const [stateLandData, setStateLandData] = useState("");
  const [countyLandData, setCountyLandData] = useState("");

  const getYearIndex = (year) => allowedYears.indexOf(year);
  const getYearFromIndex = (index) => allowedYears[index];

  useEffect(() => {
    if (selectedState) {
      const stateData = statesAndCounties.find((state) => state.state_code === selectedState);
      if (stateData) {
        setCounties(stateData.counties);
        setSelectedStartDate(allowedYears[0]);
        setSelectedEndDate(allowedYears[allowedYears.length - 1]);
      } else {
        setCounties([]);
      }
      setSelectedCounty("");
    }
  }, [allowedYears, selectedState, statesAndCounties]);

  useEffect(() => {
    const fetchStateData = async () => {
      if (!selectedState) return;
      try {
        const response = await fetch('http://127.0.0.1:5000/get-state-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          body: JSON.stringify({
            year1: selectedStartDate,
            year2: selectedEndDate,
            state: selectedState,
            name: statesMap[selectedState],
          }),
        });
        const data = await response.json();
        setStateLandData(data);
        setCountyLandData(""); // Clear county data on state change
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };

    fetchStateData();
  }, [selectedState, selectedStartDate, selectedEndDate]);

  useEffect(() => {
    const fetchCountyData = async () => {
      if (!selectedCounty) return;
      try {
        const response = await fetch('http://127.0.0.1:5000/get-county-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          body: JSON.stringify({
            year1: selectedStartDate,
            year2: selectedEndDate,
            state: selectedState,
            name: selectedCounty.toUpperCase()
          }),
        });
        const data = await response.json();
        setCountyLandData(data);
      } catch (error) {
        console.error("Error fetching county data:", error);
      }
    };

    fetchCountyData();
  }, [selectedCounty, selectedStartDate, selectedEndDate, selectedState]);

  const handleStartDateChange = (event) => {
    const newYear = getYearFromIndex(parseInt(event.target.value, 10));
    if (newYear <= selectedEndDate) setSelectedStartDate(newYear);
  };

  const handleEndDateChange = (event) => {
    const newYear = getYearFromIndex(parseInt(event.target.value, 10));
    if (newYear >= selectedStartDate) setSelectedEndDate(newYear);
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

        {/* ✅ STATE LAND DATA */}
        {selectedState && stateLandData && (
          <div className="state-county-data">
            <h3>
              Land Data for {statesAndCounties.find(state => state.state_code === selectedState)?.state_name || 'Selected State'}
            </h3>
          </div>
        )}

        <form>
          {!selectedState && <h3>Select a State</h3>}


          {selectedState && !selectedCounty && (
            <h4 style={{ marginTop: "1rem" }}>SELECT A COUNTY</h4>
          )}

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

        {/* THISSSSS ISSSS FOR COUNTYYYYYYYYY */}

        {selectedCounty && countyLandData && (
          <div>
            <div className="landloss-section">
              <div className="landloss-box">
                <h3>State Landloss</h3>
                {console.log(stateLandData)}

                <p className="landloss-value">{stateLandData.state_land_change_percentage === "N/A"
                    ? stateLandData.state_land_change_percentage
                    : `${stateLandData.state_land_change_percentage.toFixed(2)}%`}</p>
              </div>
              <div className="landloss-box">
                <h3>County Landloss</h3>
                {console.log(countyLandData)}
                <p className="landloss-value">{countyLandData.county_land_change_percentage === "N/A"
                    ? countyLandData.county_land_change_percentage
                    : `${countyLandData.county_land_change_percentage.toFixed(2)}%`}</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default DataForm;
