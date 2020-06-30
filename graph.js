/**
 * This file contains code that creates/changes the graph pertaining the the health region on the map
 */

var ctx = document.getElementById('myChart');

var dailyData = [];

console.log(window.healthRegions.features[1]);

dailyData = window.healthRegions.features[1].properties.data.map((dataEntry) => {
    return dataEntry.casecount;
});

let xLabels = window.healthRegions.features[1].properties.data.map((dataEntry) => {
    return new Date(dataEntry.retrieved_at);
});


console.log(dailyData);

var chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(231,233,237)'
};

var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: xLabels.reverse(),
    datasets: [{
      type: 'line',
      label: 'Daily Avg',
      data: dailyData.reverse(),
      borderColor: chartColors.red,
      backgroundColor: chartColors.red,
      borderWidth: 5,
      fill: false,
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'COVID-19 Cases over Time'
    },
    tooltips: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      xAxes: [{
        gridLines: {
          offsetGridLines: false,
        }
      }, {
        id: 'x-axis-2',
        type: 'linear',
        position: 'bottom',
        display: false,
        ticks: {
          min: 0,
          max: 168,
          stepSize: 24
        }
      }],
    }
  }
});
