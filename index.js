
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

