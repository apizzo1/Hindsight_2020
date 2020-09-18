

// choose dataset
var url ="https://opendata.arcgis.com/datasets/5da472c6d27b4b67970acc7b5044c862_0.geojson";

// create map object
var myMap = L.map("map", {
    // center of the United States
    center: [39.8, -98.6], 
    zoom: 5
});

// add tile layer 
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

// https://leafletjs.com/examples/choropleth/
L.geoJson(statesData).addTo(myMap);

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
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.geoJson(statesData, {style: style}).addTo(myMap);

d3.json(url, function(response) {
 
    console.log(response);

    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };
    
    // plot all fires as circles
    L.geoJSON(response, {
        style: myStyle
    }).addTo(myMap);

    // https://stackoverflow.com/questions/27804460/show-a-marker-for-polygons-from-a-geojson-file-in-leaflet
    // var geoJsonLayer = L.geoJson(response, {
    //     onEachFeature: function (feature, layer) {
    //         // Check if feature is a polygon
    //         if (feature.geometry.type === 'MultiPolygon') {
    //             // Don't stroke and do opaque fill
    //             layer.setStyle({
    //                 'weight': 0,
    //                 'fillOpacity': 0
    //             });
    //             // Get bounds of polygon
    //             var bounds = layer.getBounds();
    //             // Get center of bounds
    //             var center = bounds.getCenter();
    //             // Use center to put marker on map
    //             var marker = L.marker(center).addTo(myMap);
    //         }
    //     }
    // }).addTo(myMap);

    // create function for marker color
    // // use ColorBrewer and code from https://leafletjs.com/examples/choropleth/
    // function getColor(mag) {
    //     return mag > 4 ? '#bd0026' :
    //            mag > 3 ? '#f03b20' :
    //            mag > 2 ? '#fd8d3c' :
    //            mag > 1 ? '#fecc5c' :
    //                       '#ffffb2';
    // }
    
    // // plot circle markers based on latitude and longitude from geoJSON
    // L.geoJSON(response, {
    //     pointToLayer: function (feature, latlng) {
    //         return L.circleMarker(latlng, {
    //             radius: feature.properties.mag*5,
    //             color: getColor(feature.properties.mag),
    //             // weight: 20,
    //             // color: "black",
    //             opacity: 1,
    //             fillOpacity: 0.8
    //         });
    //     }
    //     add popup with earthquake information
    // }).bindPopup(function (layer) {
    //         return (`Location: ${layer.feature.properties.place} <br> Magnitude: ${layer.feature.properties.mag}`);
    //     }).addTo(myMap);

        // Add map legend
        // starter code from https://leafletjs.com/examples/choropleth/

});