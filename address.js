/** Function to check if the 'point' (coordinates) are within a region of points */
function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

//Function that tells if masks are required or not depending upon the numCases:
function shouldWearMask(numCases){
    if(numCases > 500){
        return true
    }
    return false;
}

//Places a marker on the map after locating it with the passed query string
async function parseAddress(queryString){
    try{
        const URL = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(queryString)}&key=${config.geocoderAPI}`;

        fetch(URL)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let resultingLocation = data.results[0];

                let provinceHealthRegionsForLocation = window.healthRegions.features.filter(region => region.properties.province == resultingLocation.components.state_code)

                //Set marker and zoom in:
                var blackIcon = new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                    });

                if(window.currentMarker){
                    window.currentMarker.remove();
                }
                window.currentMarker = L.marker([resultingLocation.geometry.lat, resultingLocation.geometry.lng], {icon: blackIcon}).addTo(mymap);
                
                //Finding which health region in province the coordinate lies in, to check if mask should be worn:
                provinceHealthRegionsForLocation.forEach(region => {
                    if(inside([resultingLocation.geometry.lng, resultingLocation.geometry.lat], region.geometry.coordinates[0][0])){
                        console.log(shouldWearMask(region.properties.data[0].casecount));
    
                        let displayStr = shouldWearMask(region.properties.data[0].casecount) ? 'Must wear a mask!' : 'Should wear a mask';

                        let popupCanvas = createCanvas('popupCanvas');                
                        
                        window.currentMarker.bindPopup(popupCanvas, {maxWidth: "auto"}).openPopup();
                        createChart(region, 'popupCanvas');
                        console.log('region', region);
                    } 
                })
                mymap.flyTo([resultingLocation.geometry.lat, resultingLocation.geometry.lng], 8);
        })
        .catch(err => console.log(err))
    }
    catch(err){
        console.log(err)
    };
}

