import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";

import InfoBox from "./components/InfoBox";
import Table from './components/Table';
import Map from "./components/Map";
import LineGraph from './components/LineGraph';
import { sortData } from "./util";

import './css/App.css'



function App() {
  const [ countries, setCountries ] = useState([]);
  const [ country, setCountry ] = useState("worldwide");
  const [ countryInfo, setCountryInfo ] = useState({});
  const [ tableData, setTableData ] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async e => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
          .then(response => response.json())
          .then(data => {
            setCountry(countryCode);
            setCountryInfo(data);
          });
  };



  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className='title'>Cov-19 Today</h1>
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
          <InfoBox title="Coronavirus Cases Today" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered Today" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox className='test' title="Deaths Today" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        <Map />
      </div>
      <Card className="app__right">
        <CardContent className='country__card'>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide New Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
