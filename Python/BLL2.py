import pandas as pd
import os
import sys
import numpy as np

# Read Excel file
file_path = '/Users/ericluong/Documents/bll2/Python/dvf_bll_bld_001_v01.csv'
df = pd.read_csv(file_path)

# Read user input
def userInput():
    year1_input = int(input("Enter the first year: "))
    year2_input = int(input("Enter the second year: "))
    state_input = int(input("Enter the state: "))
    county_input = int(input("Enter the county: "))

    return year1_input, year2_input, state_input, county_input

# Extract data from user input
def filterCell(y1, y2, state, county):
    year1_data = df[(df['year'] == y1) & (df['state'] == state) & (df['county'] == county)]
    year2_data = df[(df['year'] == y2) & (df['state'] == state) & (df['county'] == county)]
    regionName = year1_data['name'].values[0].title()

    # Check if cell exists
    if year1_data.empty or year2_data.empty:
        print("Data for the given year(s), state, or county is not available.")
        sys.exit()
    else:
        return year1_data, year2_data, regionName
    
# Calculate the percentage change of land for Operator-Owned, Fully-Owned, Part-Owned
def calcLand(y1, y2):

    # Assign land values from Excel to variables
    lifTot_y1 = y1['liftot'].values[0]
    lifTot_y2 = y2['liftot'].values[0]
    lifFullOwn_y1 = y1['liffullown'].values[0]
    lifFullOwn_y2 = y2['liffullown'].values[0]
    lifPartOwn_y1 = y1['lifpartown'].values[0]
    lifPartOwn_y2 = y2['lifpartown'].values[0]

    # Calculate change in acres of land
    lifTot_change = (lifTot_y2 - lifTot_y1)
    lifFullOwn_change = (lifFullOwn_y2 - lifFullOwn_y1) 
    lifPartOwn_change = (lifPartOwn_y2 - lifPartOwn_y1)

    # Calculate percentage change in acres of land
    lifTot_percent = lifTot_change / lifTot_y1 * 100
    lifFullOwn_percent = lifFullOwn_change / lifFullOwn_y1 * 100
    lifPartOwn_percent = lifPartOwn_change / lifPartOwn_y1 * 100

     # Assign Value values from Excel
    """
    valTot_y1 = y1['valtot'].values[0]
    valTot_y2 = y2['valtot'].values[0]
    valFullOwn_y1 = y1['valfullown'].values[0]
    valFullOwn_y2 = y2['valfullown'].values[0]
    valPartOwn_y1 = y1['valpartown'].values[0]
    valPartOwn_y2 = y2['valpartown'].values[0]
    """

    # Calculate value per acre
    """
    valTotAcre_y1 = valTot_y1/lifTot_y1
    valTotAcre_y2 = valTot_y2/lifTot_y2
    valFullAcre_y1 = valFullOwn_y1/lifFullOwn_y1
    valFullAcre_y2 = valFullOwn_y2/lifFullOwn_y2
    valPartAcre_y1 = valPartOwn_y1/lifPartOwn_y1
    valPartAcre_y2 = valPartOwn_y2/lifPartOwn_y2
    """

    # Return values as dictionary
    return {
        "lifTot_change": lifTot_change, 
        "lifFullOwn_change": lifFullOwn_change, 
        "lifPartOwn_change": lifPartOwn_change,
        "lifTot_percent": lifTot_percent, 
        "lifFullOwn_percent": lifFullOwn_percent, 
        "lifPartOwn_percent": lifPartOwn_percent
    }

    """
        "valTotAcre_y1" : valTotAcre_y1,
        "valTotAcre_y2" : valTotAcre_y2,
        "valFullAcre_y1" : valFullOwn_y1/lifFullOwn_y1,
        "valFullAcre_y2" : valFullOwn_y2/lifFullOwn_y2,
        "valPartAcre_y1" : valPartOwn_y1/lifPartOwn_y1,
        "valPartAcre_y2" : valPartAcre_y2
    """

def main():
    input = userInput()
    dates = filterCell(input[0], input[1], input[2], input[3])
    landloss = calcLand(dates[0], dates[1])
    print(dates[2])
main()