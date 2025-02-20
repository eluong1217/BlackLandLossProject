from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:8000"])

# Read Excel file
file_path = './dvf_bll_bld_001_v01.csv'
df = pd.read_csv(file_path)
df = df.fillna(0)

# Retrieve all states and counties
states = {
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

dates = {
    1920: "1920",
    1925: "1925",
    1930: "1930",
    1935: "1935",
    1940: "1940",
    1945: "1945",
    1950: "1950",
    1954: "1954",
    1959: "1959",
    1964: "1964",
    1969: "1969",
    1974: "1974",
    1978: "1978",
    1982: "1982",
    1987: "1987",
    1992: "1992",
    1997: "1997"
}

# Initialize dictionary to store county names per state
counties = {state_code: set() for state_code in states.keys()}


# Populate the dictionary
for _, row in df.iterrows():
    if row['county'] != 0 and row['year'] != 2002:
        if isinstance(row['name'], str):
            county_name = row['name'].strip()
            counties[row['state']].add(county_name)

# Convert sets to lists for easier handling
counties = {state: sorted(list(county_set)) for state, county_set in counties.items()}

@app.route('/get_states_and_counties', methods=['GET'])
def get_states_and_counties():
    # Prepare the data
    states_and_counties = [{
        'state_code': state,
        'state_name': states[state],
        'counties': counties[state],
        'dates': list(dates.values())
    } for state in counties]
    
    return jsonify(states_and_counties)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 

