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

const queryString = encodeURI('Toronto');

const URL = `https://api.opencagedata.com/geocode/v1/json?q=${queryString}&key=${config.geocoderAPI}`;

fetch(URL)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        let resultingLocation = data.results[0];

        let provinceHealthRegionsForLocation = window.healthRegions.features.filter(region => region.properties.province == resultingLocation.components.state_code)

        //Finding which health region in province the coordinate lies in:
        
        console.log('Province regions: ', provinceHealthRegionsForLocation);

        provinceHealthRegionsForLocation.forEach(region => {
            if(inside([resultingLocation.geometry.lng, resultingLocation.geometry.lat], region.geometry.coordinates[0][0])){
                console.log(region);
            } 
        })
    })
    .catch(err => console.log(err))
