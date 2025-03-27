import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "./styles.css";

const US_TOPO_JSON = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Only allow these states to be clickable
const stateNameMap = {
  "Delaware": "DELAWARE",
  "Missouri": "MISSOURI",
  "Virginia": "VIRGINIA",
  "Alabama": "ALABAMA",
  "Arkansas": "ARKANSAS",
  "Florida": "FLORIDA",
  "Georgia": "GEORGIA",
  "Louisiana": "LOUISIANA",
  "Mississippi": "MISSISSIPPI",
  "North Carolina": "NORTH CAROLINA",
  "South Carolina": "SOUTH CAROLINA",
  "Texas": "TEXAS",
  "Kentucky": "KENTUCKY",
  "Maryland": "MARYLAND",
  "Oklahoma": "OKLAHOMA",
  "Tennessee": "TENNESSEE",
  "West Virginia": "WEST VIRGINIA"
};

const USMap = ({ selectedState, setSelectedState, statesAndCounties }) => {
  // eslint-disable-next-line no-unused-vars
  const [tooltipContent, setTooltipContent] = useState("");

  return (
    <div className="map-container"> {/* Fixed size wrapper */}
      <Tooltip id="us-map-tooltip" />

      <ComposableMap
        projection="geoAlbersUsa"
        width={800}  // Keep width fixed
        height={500}  // Keep height fixed
        projectionConfig={{ scale: 1000 }} // Consistent scaling
      >
        <Geographies geography={US_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const mapStateName = geo.properties.name;
              const jsonStateName = stateNameMap[mapStateName];

              const stateData = statesAndCounties.find(
                (state) => state.state_name === jsonStateName
              );

              const isSelected = stateData && stateData.state_code === selectedState;
              const isClickable = !!jsonStateName;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  data-tooltip-id="us-map-tooltip"
                  data-tooltip-content={mapStateName}
                  onMouseEnter={() => setTooltipContent(mapStateName)}
                  onMouseLeave={() => setTooltipContent("")}
                  onClick={() => {
                    if (isClickable && stateData) {
                      console.log(`Clicked on: ${mapStateName}, Setting state_code: ${stateData.state_code}`);
                      setSelectedState(stateData.state_code);
                    }
                  }}
                  style={{
                    default: {
                      fill: isSelected ? "#FF5733" : isClickable ? "#D6D6DA" : "#F0F0F0",
                      outline: "none",
                      cursor: isClickable ? "pointer" : "not-allowed"
                    },
                    hover: {
                      fill: isClickable ? (isSelected ? "#FF5733" : "#F53") : "#F0F0F0",
                      outline: "none"
                    },
                    pressed: {
                      fill: isClickable ? "#E42" : "#F0F0F0",
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default USMap;

