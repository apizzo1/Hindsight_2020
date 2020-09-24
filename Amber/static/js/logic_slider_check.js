// date set
var user_selected_date = 1577836801000;

// needed for fire data
// var user_selected_date_plus_one = user_selected_date + (60 * 60 * 24 * 1000);

var date_start = '2020-07-17';
var date_end = '2020-07-18';
var csv_date = '01-Sep-2020';

// choose dataset
// var active_fire_url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Public_Wildfire_Perimeters_View/FeatureServer/0/query?where=CreateDate%20%3E%3D%20TIMESTAMP%20'2020-01-01%2000%3A00%3A00'%20AND%20CreateDate%20%3C%3D%20TIMESTAMP%20'${date_start}%2000%3A00%3A00'&outFields=*&outSR=4326&f=json`;
// var previously_active_fire_url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Archived_Wildfire_Perimeters2/FeatureServer/0/query?where=CreateDate%20%3E%3D%20TIMESTAMP%20'2020-01-01%2000%3A00%3A00'%20AND%20CreateDate%20%3C%3D%20TIMESTAMP%20'${date_start}%2000%3A00%3A00'%20AND%20GDB_TO_DATE%20%3E%3D%20TIMESTAMP%20'${date_end}%2000%3A00%3A00'%20AND%20GDB_TO_DATE%20%3C%3D%20TIMESTAMP%20'2021-01-01%2000%3A00%3A00'&outFields=*&outSR=4326&f=json`;
var url = "https://opendata.arcgis.com/datasets/5da472c6d27b4b67970acc7b5044c862_0.geojson";
// var contained_fire_url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Archived_Wildfire_Perimeters2/FeatureServer/0/query?where=GDB_TO_DATE%20%3E%3D%20TIMESTAMP%20'${date_start}%2000%3A00%3A00'%20AND%20GDB_TO_DATE%20%3C%3D%20TIMESTAMP%20'${date_end}%2000%3A00%3A00'&outFields=*&outSR=4326&f=json`;



// add tile layer 
var street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// satellite layer
var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// grayscale layer
var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});


function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
                d > 100 ? '#FC4E2A' :
                    d > 50 ? '#FD8D3C' :
                        d > 20 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
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
$.getJSON(url, function (data) {
    active.addData(data);
    // console.log(data)
});

updateSlider('2020-01-01');

function updateSlider(date) {
    // var date_start = '2020-07-17';
    date_start = date;
    date_end = '2020-07-18';
    csv_date = '01-Sep-2020';

    // if(map.hasLayer(containedFireLayer)){
    //     containedFireLayer.clearLayers();
    // }

    // if(map.hasLayer(protestLayer)){
    //     protestLayer.clearLayers();
    // }


    // contained fire data
    var contained_fire_url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Archived_Wildfire_Perimeters2/FeatureServer/0/query?where=GDB_TO_DATE%20%3E%3D%20TIMESTAMP%20'${date_start}%2000%3A00%3A00'%20AND%20GDB_TO_DATE%20%3C%3D%20TIMESTAMP%20'${date_end}%2000%3A00%3A00'&outFields=*&outSR=4326&f=json`;
    var contained_fires = [];
    d3.json(contained_fire_url).then(function (data) {
        console.log(`Contained Fires:${data.features.length}`);
        // console.log(response.features[1].geometry.rings[0][0]);
        for (var i = 0; i < data.features.length; i++) {
            // try {
                // console.log(data.features[i].geometry.rings[0][0]);
                contained_fires.push(
                    L.circle([data.features[i].geometry.rings[0][0][1], data.features[i].geometry.rings[0][0][0]], { radius: 20000 })
                )
            // }
            // catch (err) {
            //     console.log("no contained fires");
            // }

        }


        // active fire data
        // var active_fire_url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Public_Wildfire_Perimeters_View/FeatureServer/0/query?where=CreateDate%20%3E%3D%20TIMESTAMP%20'2020-01-01%2000%3A00%3A00'%20AND%20CreateDate%20%3C%3D%20TIMESTAMP%20'${date_start}%2000%3A00%3A00'&outFields=*&outSR=4326&f=json`;
        // var active_fires = [];
        // d3.json(active_fire_url).then(function (data) {
        //     console.log(data);
        // for (var i =0; data.features.length;i++) {

        //     active_fires.push(
        //         L.circle([data.features[i].geometry.rings[0][0][1],data.features[i].geometry.rings[0][0][0]], {color:"red", radius:20000})
        //     )
        // }


        // protest data

        var protestMarkers = [];
        d3.csv("../data/USA_2020_Sep12.csv").then(function (data) {
            // console.log(data);
            // filter for user selected date
            // source: https://stackoverflow.com/questions/23156864/d3-js-filter-from-csv-file-using-multiple-columns
            var filteredData = data.filter(function (d) {
                if (d["EVENT_DATE"] == csv_date) {
                    return d;
                }

            })

            for (var i = 0; i < filteredData.length; i++) {
                // console.log(data[i].LOCATION);

                protestMarkers.push(
                    L.marker([filteredData[i]["LATITUDE"], filteredData[i]["LONGITUDE"]]).bindPopup(filteredData[i]["LOCATION"]))
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
                Streetview: street,
                Satellite: satellite,
                Grayscale: grayscale
            };

            // adding overlay layers for user to select
            var overlayMaps = {
                Active: active,
                // Active: activeFireLayer,
                Contained: containedFireLayer,
                Protests: protestLayer
            };

            // source: https://stackoverflow.com/questions/19186428/refresh-leaflet-map-map-container-is-already-initialized
            var container = L.DomUtil.get('map');
            if(container != null){
                container._leaflet_id = null;
            }

            // create map object
            var myMap = L.map("map", {
                // center of the United States
                center: [39.8, -98.6],
                zoom: 4,
                layers: [street, active]
            });

            // adding layer control to map
            L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

            // make map interactive 
            // source: https://leafletjs.com/examples/choropleth/
            var stategeoJson;

            // function to zoom into a state when the user clicks the state
            function zoomToFeature(e) {
                myMap.fitBounds(e.target.getBounds());
                console.log(e);
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
                layer.bindPopup(`Insert chart here `),
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature,

                    });
            }

            // add state boundaries
            // source: https://leafletjs.com/examples/choropleth/
            stategeoJson = L.geoJson(statesData, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(myMap);

        })
    })
    // })
}

console.log("TESTING");

// slider
// =======================================================================
// Create a new date from a string, return as a timestamp.
function timestamp(str) {
    return new Date(str).getTime();
}

console.log(timestamp("2020"));
console.log(timestamp("09-jun-2020"));

var dateSlider = document.getElementById('slider-date');

noUiSlider.create(dateSlider, {
    // Create two timestamps to define a range.
    range: {
        min: timestamp('2020-01-02'),
        max: timestamp('2020-09-24')
    },

    // Steps of one week
    // step: 7* 24 * 60 * 60 * 1000,

    // Two more timestamps indicate the handle starting positions.
    start: timestamp('2020'),

    // No decimals
    format: wNumb({
        decimals: 0
    })
});

// source: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    // var months_csv = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    // var month_csv = months_csv[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var time = year + '-' + month + '-' + date;
    // var csv_date = date + '-' + month_csv + '-' + year;
    return time;

}
// function for updating layer data (testing)
// function sliderUpdate(date) {
//     console.log(`Changing with ${date}`);
// }

// after user selects date with mouse, return date
dateSlider.noUiSlider.on('end', function (values, handle) {

    var date_select = values[handle];
    console.log(`handle_read: ${date_select}`);

    //   user date in human readable format
    user_selected_date = timeConverter(date_select / 1000);
    // user_selected_date_plus_one = date_select;

    console.log(`new user date: ${user_selected_date}`);
    // console.log(`user date plus one: ${user_selected_date_plus_one}`);
    d3.select("#date_select").text(`Date selected: ${user_selected_date}`);

    var date_change_test = new Date(user_selected_date);
    var timestamp = date_change_test.getTime();
    console.log(`reconvert: ${timestamp}`);

    updateSlider(user_selected_date);

});

// allowing user to use keyboard to change slider
dateSlider.noUiSlider.on('change', function (values, handle) {
    var date_select = values[handle];
    //   user date in human readable format
    user_selected_date = timeConverter(date_select / 1000);
    console.log(`new user date: ${user_selected_date}`);
    updateSlider(user_selected_date);
});



