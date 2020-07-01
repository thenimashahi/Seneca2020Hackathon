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
        fillOpacity: 0.7
    };
}

// L.geoJson(window.healthRegions, {style: style}).addTo(mymap);

//Changes style of the boundary when hovered over:
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    //Custom info:
    info.update(layer.feature.properties);

    //Call a function when the user hovers over the region to show the chart:
    createChart(layer.feature, 'myChart')

    console.log('layer.feature', layer.feature);
}
//Resets style of the boundary when mouse is no longer hovering over it:
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    //Custom info:
    info.update();
}

//To zoom into the clicked boundary:
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

//Adding listeners:
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var geojson = L.geoJson(window.healthRegions, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap);

//Custom info control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Health Region Case Count</h4>' +  (props ?
        '<b>' + props.ENG_LABEL + '</b><br />' + props.data[0].casecount + ' Covid-19 cases'
        : 'Hover over a health unit');
};

info.addTo(mymap);

//Creating a legend:
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(mymap);