// date set

var date_start = '2020-08-06';
var date_end = '2020-08-07';
var csv_date = '01-Sep-2020';

// choose dataset
var active_fire_url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Public_Wildfire_Perimeters_View/FeatureServer/0/query?where=CreateDate%20%3E%3D%20TIMESTAMP%20'2020-01-01%2000%3A00%3A00'%20AND%20CreateDate%20%3C%3D%20TIMESTAMP%20'${date_start}%2000%3A00%3A00'&outFields=*&outSR=4326&f=json`;
var url ="https://opendata.arcgis.com/datasets/5da472c6d27b4b67970acc7b5044c862_0.geojson";

// var url2 = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Archived_Wildfire_Perimeters2/FeatureServer/0/query?where=GDB_FROM_DATE%20%3E%3D%20TIMESTAMP%20'2020-06-06%2000%3A00%3A00'%20AND%20GDB_FROM_DATE%20%3C%3D%20TIMESTAMP%20'2020-06-07%2000%3A00%3A00'&outFields=*&outSR=4326&f=json";
var contained_fire_url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Archived_Wildfire_Perimeters2/FeatureServer/0/query?where=GDB_FROM_DATE%20%3E%3D%20TIMESTAMP%20'${date_start}%2000%3A00%3A00'%20AND%20GDB_FROM_DATE%20%3C%3D%20TIMESTAMP%20'${date_end}%2000%3A00%3A00'&outFields=*&outSR=4326&f=json`;
// var archived_fire_data = "https://opendata.arcgis.com/datasets/bf373b4ff85e4f0299036ecc31a1bcbb_0.geojson";


// add tile layer 
var street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

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

// map boundary styling
function style(feature) {
    return {
        // fillColor: getColor(feature.properties.density),
        fillColor: "white",
        weight: 2,
        // opacity: 1,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.1
    };
}

// active fire styling
var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };

// contained fire styling
var myStyle2 = {
        "color": "blue",
        "weight": 5,
        "opacity": 0.65
    };


// active fire data
// source: https://gis.stackexchange.com/questions/149378/adding-multiple-json-layers-to-leaflet-map
var active = L.geoJSON(null, {
    style: myStyle
  });

  
// Get GeoJSON data and create features.
// source: https://gis.stackexchange.com/questions/336179/add-more-than-one-layer-of-geojson-data-to-leaflet
$.getJSON(url, function(data) {
active.addData(data);
// console.log(data)
});

// contained fire data
var contained_fires =[];
d3.json(contained_fire_url).then(function(data) {
    // console.log(data.features);
    // console.log(response.features[1].geometry.rings[0][0]);
    for (var i =0;i<data.features.length;i++) {
        // console.log(data.features[i].geometry.rings[0][0]);
        contained_fires.push(
            L.circle([data.features[i].geometry.rings[0][0][1],data.features[i].geometry.rings[0][0][0]], {radius:20000})
        )
        
    }

    
    // active fire data
    // var active_fires = [];
    // d3.json(active_fire_url).then(function(data) {
    //     console.log(data);
    //     // for (var i =0; data.features.length;i++) {

            // active_fires.push(
            //     L.circle([data.features[i].geometry.rings[0][0][1],data.features[i].geometry.rings[0][0][0]], {color:"red", radius:20000})
            // )
        // }
    
 
    // protest data

    var protestMarkers = [];
    d3.csv("../data/USA_2020_Sep12.csv").then(function(data) {
        // console.log(data);
        // filter for user selected date
        // source: https://stackoverflow.com/questions/23156864/d3-js-filter-from-csv-file-using-multiple-columns
        var filteredData = data.filter(function(d) { 
            if( d["EVENT_DATE"] == csv_date) { 
                    return d;
                } 
        
            })
      
        for (var i=0; i<filteredData.length;i++) {
            // console.log(data[i].LOCATION);
           
            protestMarkers.push(
                L.marker([filteredData[i]["LATITUDE"],filteredData[i]["LONGITUDE"]]).bindPopup(filteredData[i]["LOCATION"]))
                // L.circle([filteredData[i]["LATITUDE"],filteredData[i]["LONGITUDE"]],{radius: 20000}))
        }

       
        // creating protest layer
        var protestLayer = L.layerGroup(protestMarkers);

        // creating contained fire layer
        var containedFireLayer = L.layerGroup(contained_fires);

        // creating active fire layer
        // var activeFireLayer = L.layerGroup(active_fires);

        // adding basemap to map
        var baseMaps = {
            Streetview: street
        };

        // adding overlay layers for user to select
        var overlayMaps = {
            Active: active,
            // Active: activeFireLayer,
            Contained: containedFireLayer,
            Protests: protestLayer
        };

        // create map object
        var myMap = L.map("map", {
            // center of the United States
            center: [39.8, -98.6], 
            zoom: 5,
            layers: [street, active]
        });

        // adding layer control to map
        L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(myMap);

        // make map interactive 
        // source: https://leafletjs.com/examples/choropleth/
        var stategeoJson;

        // function to zoom into a state when the user clicks the state
        function zoomToFeature(e) {
            myMap.fitBounds(e.target.getBounds());
        }

  
        // function when user mouses over feature
        function highlightFeature(e) {
            var layer = e.target;
        
            layer.setStyle({
                weight: 5,
                color: 'blue',
                dashArray: '',
                fillOpacity: 0.3
            });
        
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }

        // function when user mouses out of a feature
        function resetHighlight(e) {
            stategeoJson.resetStyle(e.target);
        }


        // use onEachFeature function to call event functions
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }
        
        // add state boundaries
        // source: https://leafletjs.com/examples/choropleth/
        stategeoJson = L.geoJson(statesData, {
            style:style,
            onEachFeature: onEachFeature
        }).addTo(myMap);

        })
    // })
}) 

// slider
// Create a new date from a string, return as a timestamp.

var select = document.getElementById('input-select');

// Append the option elements
for (var i = -20; i <= 40; i++) {

    var option = document.createElement("option");
    option.text = i;
    option.value = i;

    select.appendChild(option);
}

var html5Slider = document.getElementById('html5');

noUiSlider.create(html5Slider, {
    start: 10,
    connect: "lower",
    step: 1,
    range: {
        'min': -20,
        'max': 40
    }
});

var input = html5Slider.noUiSlider.get();
console.log(input);


// var inputNumber = document.getElementById('input-number');

html5Slider.noUiSlider.on('update', function (values, handle) {

    var value = values[handle];
    // console.log(value);
    if (handle) {
        inputNumber.value = value;
        
    } else {
        select.value = Math.round(value);
    }
});

html5Slider.noUiSlider.on('end', function (values, handle) {

var value = values[handle];
console.log(value);

});

select.addEventListener('change', function () {
    
    html5Slider.noUiSlider.set([this.value]);
    
    
});




 
// ******************OLD or unneeded below*************************

// function timestamp(str) {
//     return new Date(str).getTime();
// }

// var slider = document.getElementById('slider');

// noUiSlider.create(slider, {
//     start: [80],
//     step: 1, 
//     range: {
//         'min': [0],
//         'max': [100]
//     }
// });

// var input_date = slider.noUiSlider.get();
// console.log(input_date);


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


