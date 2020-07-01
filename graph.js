/**
 * This file contains code that creates/changes the graph pertaining the the health region on the map
 */

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(231,233,237)'
};

//Populates a chart using the passed data
function createChart(healthRegion, id){
    
    var ctx = document.getElementById(id);

    let xLabels = healthRegion.properties.data.map((dataEntry) => {
        return new Date(dataEntry.retrieved_at);
    });
    
    let yData = healthRegion.properties.data.map((dataEntry) => {
        return dataEntry.casecount;
    });

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels.reverse(),
            datasets: [{
            type: 'line',
            label: `Covid Data for ${healthRegion.properties.ENG_LABEL}, ${healthRegion.properties.province}`,
            data: yData.reverse(),
            borderColor: chartColors.red,
            backgroundColor: chartColors.red,
            borderWidth: 5,
            pointRadius: 0,
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
                },
                ticks: {
                maxTicksLimit: 6,
                minRotation: 90,
                    // Include a dollar sign in the ticks
                    callback: function(value) {
                    let options = { month: 'long', day: 'numeric', year: 'numeric' };
                    return value.toLocaleString('en-US', options);
                    }
                }
            }],
            }
        }
    });
}

//Creates a small 50x50 canvas and returns it with the specified id
function createCanvas(id){
    var ctx = document.createElement('canvas');

    ctx.setAttribute('width', '500');
    ctx.setAttribute('height', '500');

    ctx.setAttribute('id', id);
    
    return ctx;
}