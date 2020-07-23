import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card } from "@material-ui/core";

import InfoBox from "./components/InfoBox";
import Map from "./components/Map";

import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async e => {
    const countryCode = e.target.value;
    setCountry(countryCode);
  };

  return (
    <div className="app">
      <div className="app__fragmemt__left">
        <div className="app__header">
          <h1>Cov-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={123} total={1000} />
          <InfoBox title="Recovered" cases={5000} total={10000} />
          <InfoBox title="Deaths" cases={43223} total={453278} />
        </div>

        <Map />
      </div>
    </div>
  );
}

export default App;
