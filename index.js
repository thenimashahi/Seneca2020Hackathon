
//Leafleft map init
var mymap = L.map('mapid').setView([56.1304, -106.3468], 4);

const access_token = 'pk.eyJ1Ijoia3NkaGlsbG9uMTEiLCJhIjoiY2tjMHJiNzNhMTN1dzJycWVxeXc1ejB6MyJ9.uXWRENzoNvoblYvIPUKV1g';

L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${access_token}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: access_token
}).addTo(mymap);

//Adding health region boundaries:
//L.geoJson(window.healthRegions).addTo(mymap);

// let data = window.canadaCovidData;

// console.log(window.healthRegions)

// let healthRegionNames = Array.from(new Set(data.map(entry => entry.engname)));

// console.log('Covid Data: ', healthRegionNames);

// let healthRegionNamesMap = Array.from(new Set(window.healthRegions.features.map(feature => feature.properties.ENG_LABEL)));

// console.log('GeoJSON data: ', healthRegionNamesMap)

// let differentOnes = healthRegionNames.filter(x => !healthRegionNamesMap.includes(x));

// console.log(differentOnes)

//Combining health region boundaries and covid data:

window.healthRegions.features.forEach((feature) => {
    let covidDataForFeature;

    covidDataForFeature = window.canadaCovidData.filter((entry) => feature.properties.ENG_LABEL == entry.engname && feature.properties.province == entry.province);
    
    //Creating a new field and storing covid data for the respective feature:
    feature.properties.data = covidDataForFeature.map((data) => {
        return{
            casecount: data.casecount,
            retrieved_at: Date.parse(data.retrieved_at),
            totalpop2019: data.totalpop2019
        }
    })
});

console.log(window.healthRegions.features.filter((feature) => feature.properties.ENG_LABEL == 'Calgary Zone'))
//Styling the map:
function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    //Find the most recent data entry for the feature:
    let recentData;

    return {
        fillColor: getColor(feature.properties.data[0].casecount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
L.geoJson(window.healthRegions, {style: style}).addTo(mymap);