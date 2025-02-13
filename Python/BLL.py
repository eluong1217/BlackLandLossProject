from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

# Read Excel file
file_path = './dvf_bll_bld_001_v01.csv'
df = pd.read_csv(file_path)
df = df.fillna(0)


# Take in user input
year1 = int(input("Enter the first year: "))
year2 = int(input("Enter the second year: "))
state_input = int(input("Enter the state: "))
county_input = int(input("Enter the county: "))


data_start = df[(df['year'] == 1920) & (df['state'] == state_input) & (df['county'] == county_input)]
data_end = df[(df['year'] == 1997) & (df['state'] == state_input) & (df['county'] == county_input)]
data_year1 = df[(df['year'] == year1) & (df['state'] == state_input) & (df['county'] == county_input)]
data_year2 = df[(df['year'] == year2) & (df['state'] == state_input) & (df['county'] == county_input)]

# If input isn't valid, say data for given variable is not available.
if data_year1.empty or data_year2.empty:
    print("Data for the given year(s), state, or county is not available.")
else:
    # Extract Data for both years
    name_year1 = data_year1['name'].values[0]

    # Land and value for 1920 and 1997
    start_land = data_start['liftot'].values[0]
    end_land = data_end['liftot'].values[0]
    start_value = (data_start['valtot'].values[0])/(data_start['liftot'].values[0])
    # print(f'{data_start['liftot'].values[0]}, {data_start['valtot'].values[0]}')
    end_value = data_end['valavg'].values[0]

    # Land data for inputted Year 1 and Year 2
    land_owned_total_year1 = data_year1['liftot'].values[0]
    land_owned_total_year2 = data_year2['liftot'].values[0]
    land_owned_full_year1 = data_year1['liffullown'].values[0]
    land_owned_full_year2 = data_year2['liffullown'].values[0]
    land_owned_part_year1 = data_year1['lifpartown'].values[0]
    land_owned_part_year2 = data_year2['lifpartown'].values[0]

    # Value data for inputted Year 1 and Year 2
    value_total_year1 = data_year1['valtot'].values[0]
    value_total_year2 = data_year2['valtot'].values[0]
    value_full_year1 = data_year1['valfull'].values[0]
    value_full_year2 = data_year2['valfull'].values[0]
    value_part_year1 = data_year1['valpart'].values[0]
    value_part_year2 = data_year2['valpart'].values[0]
    value_average_year1 = data_year1['valavg'].values[0] 
    value_average_year2 = data_year2['valavg'].values[0]

    # Value data of Year 1 converted to Value per Acre, as well as highest and lowest
    val_acre_tot1 = value_total_year1/land_owned_total_year1
    print(f'value full year: {value_full_year1}, land owned full year: {land_owned_full_year1}')
    print(f'value part year: {value_full_year1}, land owned part year: {land_owned_full_year1}')

    sig_val_acre = 3
    if value_full_year1 == 0 and land_owned_full_year1 == 0:
        val_acre_fullown1 = 0
        sig_val_acre = sig_val_acre - 1
    else:
        val_acre_fullown1 = value_full_year1/land_owned_full_year1

    if value_part_year1 == 0 and land_owned_part_year1 == 0:
        val_acre_partown1 = 0
        sig_val_acre = sig_val_acre - 1 
    else:
        val_acre_partown1 = value_part_year1/land_owned_part_year1

    highest_val_year1 = max(val_acre_tot1, val_acre_fullown1, val_acre_partown1)
    lowest_val_year1 = min(val_acre_tot1, val_acre_fullown1, val_acre_partown1)

    # Value data of Year 2 converted to Value per Acre, as well as highest and lowest
    val_acre_tot2 = value_total_year2/land_owned_total_year2
    val_acre_fullown2 = value_full_year2/land_owned_full_year2
    val_acre_partown2 = value_part_year2/land_owned_part_year2
    highest_val_year2 = max(val_acre_tot2, val_acre_fullown2, val_acre_partown2)
    lowest_val_year2 = min(val_acre_tot2, val_acre_fullown2, val_acre_partown2)

    # Calculate valavg if there is no present value
    if value_average_year1 == 0:
        value_average_year1 = (val_acre_tot1 + val_acre_fullown1 + val_acre_partown1) / sig_val_acre

    if value_average_year2 == 0:
        value_average_year2 = (val_acre_tot2 + val_acre_fullown2 + val_acre_partown2) / sig_val_acre

    # Calculate the percentage change
    total_land_change_percentage = ((end_land - start_land) / start_land) * 100
    land_change_percentage = ((land_owned_total_year2 - land_owned_total_year1) / land_owned_total_year1) * 100

    # Display the results
    print(f"\nResults for {name_year1}:")
    print(f"Total land owned from 1920 to 1997: {total_land_change_percentage:.2f}%")
    print(f"Total in land value per acre from 1920 to 1997: {start_value} to {end_value:.2f}")
    print(f"Change in land owned from {year1} to {year2}: {land_change_percentage:.2f}%")
    print(f"Change in land value per acre from {year1} to {year2}: {value_average_year1} to {value_average_year2:.2f}")
    print(f"Highest Value per acre in {year1} is {highest_val_year1}")
    print(f"Highest Value per acre in {year2} is {highest_val_year2}")
    print(f"Lowest Value per acre in {year1} is {lowest_val_year1}")
    print(f"Lowest Value per acre in {year2} is {lowest_val_year2}")
