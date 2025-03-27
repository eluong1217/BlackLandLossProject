from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:8000"])

# Read Excel file
file_path = './dvf_bll_bld_001_v01.csv'
df = pd.read_csv(file_path)
df = df.fillna(-1)
df['name'] = df['name'].str.strip()


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


@app.route('/get-data', methods=['POST'])
def get_data():
    try:
        data = request.json
        year1 = int(float(data.get('year1')))
        year2 = int(float(data.get('year2')))
        name_input = data.get('name') 
        state_input = data.get('state')

        # Getting State Data
        state_y1 = df[(df['year'] == year1) & (df['name'] == name_input) & (df['county'] == 0)]
        state_y2 = df[(df['year'] == year2) & (df['name'] == name_input) & (df['county'] == 0)]
        # Getting County Data
        county_y1 = df[(df['year'] == year1) & (df['name'] == name_input) & (df['state'] == state_input)]
        county_y2 = df[(df['year'] == year2) & (df['name'] == name_input) & (df['state'] == state_input)]
    
        if state_y1.empty or state_y2.empty:
            return jsonify({"error": "Data for the given year(s), state, or name is not available."})
        if county_y1.empty or county_y2.empty:
            return jsonify({"error": "Data for the given year(s), state, or name is not available."})


        state_land_y1 = state_y1['liftot'].values[0]
        state_land_y2 = state_y2['liftot'].values[0]
        county_land_y1 = county_y1['liftot'].values[0]
        county_land_y2 = county_y2['liftot'].values[0]
        # land_owned_total_year1 = state_land_y1['liftot'].values[0]
        # land_owned_total_year2 = state_land_y2['liftot'].values[0]
        


        value_total_year1 = state_land_y1['valtot'].values[0]
        value_total_year2 = state_land_y2['valtot'].values[0]
        value_average_year1 = state_land_y1['valavg'].values[0] 
        value_average_year2 = state_land_y2['valavg'].values[0]

        print(state_land_y1, state_land_y2)
        val_acre_tot1 = value_total_year1 / state_land_y1
        val_acre_tot2 = value_total_year2 / state_land_y2

        if state_land_y1['liftot'].values[0] == -1 or state_land_y2['liftot'].values[0] == -1:
            total_land_change_percentage = "N/A"
            land_change_percentage = "N/A"
        else:
            total_land_change_percentage = ((state_land_y2 - state_land_y1) / state_land_y1) * 100
            land_change_percentage = ((state_land_y2 - state_land_y1) / state_land_y1) * 100
            
        print(state_land_y1, state_land_y2)

        response_data = {
            "name": name_input,
            "total_land_change_percentage": total_land_change_percentage,
            "land_change_percentage": land_change_percentage,
            "value_change": {
                "year1": value_average_year1,
                "year2": value_average_year2
            },
            "land_value_range": {
                "year1": {"highest": val_acre_tot1, "lowest": val_acre_tot1},
                "year2": {"highest": val_acre_tot2, "lowest": val_acre_tot2}
            }
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 



