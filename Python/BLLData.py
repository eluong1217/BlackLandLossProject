from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Replace with your React app's origin

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

# Initialize dictionary to store county names per state
counties = {state_code: set() for state_code in states.keys()}

# Populate the dictionary
for _, row in df.iterrows():
    if row['county'] != 0 and row['state'] in states:
        if isinstance(row['name'], str):
            county_name = row['name'].strip()
            counties[row['state']].add(county_name)

# Convert sets to lists for easier handling
counties = {state: list(county_set) for state, county_set in counties.items()}

@app.route('/get_states_and_counties', methods=['GET'])
def get_states_and_counties():
    # Prepare the data
    states_and_counties = [{
        'state_code': state,
        'state_name': states[state],
        'counties': counties[state]
    } for state in counties]
    
    return jsonify(states_and_counties)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 

