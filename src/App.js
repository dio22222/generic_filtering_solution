import React, {useEffect, useState} from "react";
import {Grid} from '@material-ui/core'
import {Map} from './Map'
import {SelectMultiple} from './SelectMultiple'
import { HAZARDTYPES, PROBABILITY, MAGNITUDE } from "./options";

const data = {'18': [
                    {'type': 'Flood and sea level rise > Coastal flood', 'probability': 'Medium', 'magnitude': 'Medium'}, 
                    {'type': 'Storm and wind > Storm surge', 'probability': 'Medium', 'magnitude': 'Medium'}, 
                    {'type': 'Extreme hot temperature > Heat wave', 'probability': 'Medium', 'magnitude': 'Medium'}, 
                    {'type': 'Extreme Precipitation > Rain storm', 'probability': 'High', 'magnitude': 'High'}
                    ], 
              '159': [
                    {'type': 'Biological hazards > Vector-borne disease', 'probability': 'Medium Low', 'magnitude': 'High'}, 
                    {'type': 'Wild fire > Forest fire', 'probability': 'Low', 'magnitude': 'Medium'}, 
                    {'type': 'Extreme cold temperature > Cold wave', 'probability': 'Medium Low', 'magnitude': 'Medium'}, 
                    {'type': 'Storm and wind > Severe wind', 'probability': 'Medium', 'magnitude': 'Medium High'}, 
                    {'type': 'Mass movement > Subsidence', 'probability': 'Medium', 'magnitude': 'Medium Low'}, 
                    {'type': 'Extreme cold temperature > Extreme cold days', 'probability': 'Medium Low', 'magnitude': 'Medium High'}, 
                    {'type': 'Flood and sea level rise > River flood', 'probability': 'Medium', 'magnitude': 'High'}, 
                    {'type': 'Extreme Precipitation > Rain storm', 'probability': 'Medium', 'magnitude': 'Medium High'}, 
                    {'type': 'Water Scarcity > Drought', 'probability': 'Medium High', 'magnitude': 'High'}, 
                    {'type': 'Extreme hot temperature > Extreme hot days', 'probability': 'Medium High', 'magnitude': 'High'}, 
                    {'type': 'Extreme hot temperature > Heat wave', 'probability': 'High', 'magnitude': 'High'}], 
              '163': [
                    {'type': 'Flood and sea level rise > Flash / surface flood', 'probability': 'High', 'magnitude': 'High'}, 
                    {'type': 'Extreme hot temperature > Heat wave', 'probability': 'High', 'magnitude': 'High'}, 
                    {'type': 'Extreme hot temperature > Extreme hot days', 'probability': 'High', 'magnitude': 'High'}
                    ], 
            }
const cities_coordinates = {'18':  {'lat': 55.67613, 'lng': 12.56571},
                            '159': {'lat': 48.8787676, 'lng': 2.3222643},
                            '163': {'lat': 50.8705213, 'lng': 7.069748}
                            }


export default function App() {
    const [hazardFilters, setHazardFilters] = useState([])
    const [probabilityFilters, setProbabilityFilters] = useState([])
    const [magnitudeFilters, setMagnitudeFilters] = useState([])
    const [filteredCitiesCoordinates, setFilteredCitiesCoordinates] = useState({})
    let filtered_cities = [], temp = [], stateUpdateObject = {}

    // Filter Cities
    useEffect(() => {

			// Filter Cities for Hazard Type
			for (const city in data) {
				for (const hazard of hazardFilters) {
					if (data[city].filter(item => item.type === hazard).length) {
						!filtered_cities.includes(city) && filtered_cities.push(city)
					}
				}
			}

			// Filter Cities for Probability of the Selected Hazards
			for (const city of filtered_cities) {
				for (const probability of probabilityFilters) {
					for (const hazard of hazardFilters) {
						if (data[city].filter(item => item.probability.includes(probability) && item.type === hazard).length) {
							!temp.includes(city) && temp.push(city)
						}
					}
				}
			}

			// Assign Filter results
			if (probabilityFilters.length) {
				filtered_cities = temp
				temp = []
			}

			// Filter Cities for Magnitude of the Selected Hazards
			for (const city of filtered_cities) {
				for (const magnitude of magnitudeFilters) {
					for (const hazard of hazardFilters) {
						if (data[city].filter(item => item.magnitude.includes(magnitude) && item.type === hazard).length) {
							!temp.includes(city) && temp.push(city)
						}
					}
				}
			}

			// Assign Filter results
			if (magnitudeFilters.length) {
				filtered_cities = temp
				temp = []
			}

			// Construct Coordinates Object from Filtered Cities
			for (const city in cities_coordinates) {
				if (filtered_cities.includes(city)) {
					stateUpdateObject[city] = cities_coordinates[city]
				}
			}

			// Update the Filtered Coordinates State
			setFilteredCitiesCoordinates(stateUpdateObject)

    }, [hazardFilters, probabilityFilters, magnitudeFilters])

    // Event Handler for Filters Change
    const handleOnFiltersChange = (type, checked) => {
        switch (type) {
            case "Hazard Filter":
                setHazardFilters(checked)
            break
            case "Probability Filter":
                setProbabilityFilters(checked)
            break
            case "Magnitude Filter":
                setMagnitudeFilters(checked)
            break
        }
    }

    return (
        <Grid container>
            <Grid item lg={2}>
                <SelectMultiple filterType={"Hazard Filter"} filterOptions={HAZARDTYPES} filters={hazardFilters} setFilters={handleOnFiltersChange} />
            </Grid>
            <Grid item lg={2}>
                <SelectMultiple filterType={"Probability Filter"} filterOptions={PROBABILITY} filters={probabilityFilters} setFilters={handleOnFiltersChange} /> 
            </Grid>
            <Grid item lg={2}>
                <SelectMultiple filterType={"Magnitude Filter"} filterOptions={MAGNITUDE} filters={magnitudeFilters} setFilters={handleOnFiltersChange} />   
            </Grid>
            <Grid item lg={12}>
                <Map data={filteredCitiesCoordinates} />
            </Grid>
        </Grid>
    );
}
