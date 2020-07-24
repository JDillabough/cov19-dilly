import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
    legendText: "Current"
  },
  elements: {
    point: {
      radius: 0
    }
  },
  maintainAspectRatio: true,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function(tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      }
    }
  },
  scales: {
    xAxes: [
      {
        type: "time"
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          callback: function(value, index, values) {
            return numeral(value).format("0a");
          }
        }
      }
    ]
  }
};

function LineGraph({ casesType = "cases" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then(response => response.json())
        .then(data => {
          const chartData = buildChartData(data, "cases");
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  return (
    <div>
      <h3>Daily Case Chart</h3>
      {data && data.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 54, 0.5",
                borderColor: "#CC1034",
                data: data
              }
            ]
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
