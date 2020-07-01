/**
 * This file contains code that creates/changes the graph pertaining the the health region on the map
 */

const chartColors = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 
'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(231,233,237)', 
'rgb(255,0,127)', 'rgb(0,0,153)' , 'rgb(102,102,0)', 'rgb(102,0,0)',
'rgb(102,102,55)', 'rgb(255,178,102)', 'rgb(102,255,255)', 'rgb(250,28,28)']

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
            borderColor: chartColors[14],
            backgroundColor: chartColors[14],
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

function createProvincialGraph(provincialData, id){
    var ctx = document.getElementById(id);

    let xLabels = provincialData[13].data.map((provDataEntry) => {
        return new Date(provDataEntry.retrieved_at);
    });
    
    let chartData = [];

    provincialData.forEach((prov, iter) => {
        let yData = prov.data.map((provDataEntry) => {
            return provDataEntry.dailyCount;
        });
        let tempObj = {
            type: 'line',
            label: `${prov.province}`,
            data: yData,
            borderColor: chartColors[iter],
            backgroundColor: chartColors[iter],
            borderWidth: 5,
            pointRadius: 0,
            fill: false,
        }
        chartData.push(tempObj);
    })

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: chartData
        },
        options: {
            responsive: true,
            title: {
            display: true,
            text: 'Daily cases over Time',
            fontSize: 20
            },
            tooltips: {
            mode: 'nearest',
            intersect: true,
            },
            legend: {
                display: true,
                labels: {
                    fontSize: 20
                }
            },
            scales: {
            xAxes: [{
                gridLines: {
                offsetGridLines: false,
                },
                ticks: {
                fontSize: 20,
                maxTicksLimit: 6,
                    // Include a dollar sign in the ticks
                    callback: function(value) {
                    let options = { month: 'long', day: 'numeric', year: 'numeric' };
                    return value.toLocaleString('en-US', options);
                    }
                }
            }],
            yAxes: [{
                ticks:{
                    min: 0,
                    beginAtZero: true,
                    fontSize: 20
                }
            }]
            }
        }
    });
}

function createProvincialData(canadaCovidData){

    let provinces = ["NS", "NL", "PE", "NB", "QC", "ON", "MB", "AB", "YT", "NT", "NU", "SK", "BC"];
    
    console.log(canadaCovidData);

    let provinceTimeData = [];

    provinces.forEach( prov => {
        let healthRegionsInProvince = canadaCovidData.filter(entry => entry.province === prov)    

        let timeDataForProvince = {province: prov, data: []};

        //Find number of dates we have data for:        
        let dateSet = Array.from(new Set(healthRegionsInProvince.map(h => h.retrieved_at)));

        for(let i = 0; i < dateSet.length; ++i){
            let tempObj = {casecount: 0, totalpop2019: 0};
            healthRegionsInProvince.forEach((region) => {
                if(dateSet[i] == region.retrieved_at){
                    tempObj.casecount += region.casecount;
                    tempObj.totalpop2019 += region.totalpop2019;
                    tempObj.retrieved_at = region.retrieved_at;
                }
            })
            timeDataForProvince.data.push(tempObj);
        }

        //Sorting it:
        timeDataForProvince.data.sort((a,b) => new Date(a.retrieved_at) - new Date(b.retrieved_at));

        //Adding daily case count, discards 1st element:
        for(let i = 1; i < dateSet.length; ++i){
            timeDataForProvince.data[i].dailyCount = timeDataForProvince.data[i].casecount - timeDataForProvince.data[i-1].casecount;
        }
        timeDataForProvince.data.splice(0,1);

        //Cleaning data:
        let uniqueDates = Array.from(new Set(timeDataForProvince.data.map(x => (x.retrieved_at.split(' ')[0] + " 23:59:59"))));

        let cleanedDataArray = [];

        uniqueDates.forEach( uDate => {
            let multipleDates = timeDataForProvince.data.filter(d => d.retrieved_at.split(' ')[0] == uDate.split(' ')[0]);
            //Since its sorted:
            cleanedDataArray.push(multipleDates[multipleDates.length - 1]);
          })

        timeDataForProvince.data = cleanedDataArray;
        provinceTimeData.push(timeDataForProvince);
    })
    console.log(provinceTimeData)

    //Add 'Canada':
    
    let canadaData = {province: 'Canada', data: []};

    for(let i = 0; i < provinceTimeData[0].data.length; ++i){
        let canadaDateObj = {casecount: 0, totalpop2019: 0, dailyCount: 0}
        provinceTimeData.forEach(prov => {
            canadaDateObj.casecount += prov.data[i].casecount;
            canadaDateObj.totalpop2019 += prov.data[i].totalpop2019;
            canadaDateObj.retrieved_at = prov.data[i].retrieved_at;
            canadaDateObj.dailyCount += prov.data[i].dailyCount
        })
        canadaData.data.push(canadaDateObj);
    }

    provinceTimeData.push(canadaData);

    return provinceTimeData;
}
//Creates a small 50x50 canvas and returns it with the specified id
function createCanvas(id){
    var ctx = document.createElement('canvas');

    ctx.setAttribute('width', '500');
    ctx.setAttribute('height', '500');

    ctx.setAttribute('id', id);
    
    return ctx;
}