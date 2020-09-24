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

var contained_fires = [];

// / create map object
var myMap = L.map("map", {
        // center of the United States
        center: [39.8, -98.6],
        zoom: 4,
        layers: street
});


var baseMaps = {
    Streetview: street,
    Satellite: satellite,
    Grayscale: grayscale
};

var overlayMaps = {};

 // adding layer control to map
 var layerControl = L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);


var counter = 0;

// create map function
function makeMap(layer) {

    myMap.removeLayer(layer);
    // var layer = updateSlider(date)
    // source: https://stackoverflow.com/questions/19186428/refresh-leaflet-map-map-container-is-already-initialized
    // var container = L.DomUtil.get('map');
    // if (container != null) {
    //     container._leaflet_id = null;
    // }

    // // create map object
    // var myMap = L.map("map", {
    //     // center of the United States
    //     center: [39.8, -98.6],
    //     zoom: 4,
    //     layers: street
    // });
    
    

    // adding overlay layers for user to select
    var overlayMaps = {
        // Active: active,
        // Active: activeFireLayer,
        Contained: layer
        // Protests: protestLayer
    };

    // myMap.addLayer(layer);

    layerControl.addOverlay(layer, 'Contained');

}

var map_component = d3.select('#map');
init(1591170927693);

function init(date) {
    
    // myMap.removeLayer(containedFireLayer);
    // if (containedFireLayer) {
    // L.control.layers.removeLayer(containedFireLayer);
    // }
    // containedFireLayer.clearLayers();

    contained_fires.length = 0;

    console.log(`length check: ${contained_fires.length}`);
    // console.log(`date given ${date}`);
    // console.log(`test date: ${timeConverter(date/1000)}`);
    date_start = timeConverter(date / 1000)
    var plus_one_day = parseInt(date) + (60 * 60 * 24 * 1000);
    // console.log(plus_one_day);
    // console.log(timeConverter(plus_one_day/1000));
    date_end = timeConverter(plus_one_day / 1000);

    // contained fire data
    var contained_fire_url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Archived_Wildfire_Perimeters2/FeatureServer/0/query?where=GDB_TO_DATE%20%3E%3D%20TIMESTAMP%20'${date_start}%2000%3A00%3A00'%20AND%20GDB_TO_DATE%20%3C%3D%20TIMESTAMP%20'${date_end}%2000%3A00%3A00'&outFields=*&outSR=4326&f=json`;
    // var contained_fires = [];
    d3.json(contained_fire_url).then(function (data) {
        console.log(`Contained Fires - testing:${data.features.length}`);
        // console.log(`testing length: ${data.features[0].geometry.rings[0][0][1]}`);
        // console.log(response.features[1].geometry.rings[0][0]);
        for (var i = 0; i < data.features.length; i++) {
            try {
                // console.log(data.features[i].geometry.rings[0][0]);
                contained_fires.push(
                    L.circle([data.features[i].geometry.rings[0][0][1], data.features[i].geometry.rings[0][0][0]], { radius: 20000 })
                )
            }
            catch (err) {
                console.log("no contained fires");
            }

        }
        console.log(contained_fires.length);

        // creating contained fire layer
        var containedFireLayer = L.layerGroup(contained_fires);

        makeMap(containedFireLayer);


        // make map interactive 
        // source: https://leafletjs.com/examples/choropleth/
        var stategeoJson;

        // function to zoom into a state when the user clicks the state
        function zoomToFeature(e) {
            myMap.fitBounds(e.target.getBounds());
            var state = e.target.feature.properties.name
            console.log(e);
            map_component.attr("state_name", state);
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
            layer.bindPopup(feature.properties.name),
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature,
                
            });
        }
        
        // add state boundaries
        // source: https://leafletjs.com/examples/choropleth/
        stategeoJson = L.geoJson(statesData, {
            style:style,
            onEachFeature: onEachFeature
        }).addTo(myMap);

        
    })

    counter = 1;

}

function updateSlider(date) {

    // myMap.removeLayer(containedFireLayer);
    // if (containedFireLayer) {
    // L.control.layers.removeLayer(containedFireLayer);
    // }
    // containedFireLayer.clearLayers();

    contained_fires.length = 0;

    console.log(`length check: ${contained_fires.length}`);
    // console.log(`date given ${date}`);
    // console.log(`test date: ${timeConverter(date/1000)}`);
    date_start = timeConverter(date / 1000)
    var plus_one_day = parseInt(date) + (60 * 60 * 24 * 1000);
    // console.log(plus_one_day);
    // console.log(timeConverter(plus_one_day/1000));
    date_end = timeConverter(plus_one_day / 1000);

    // contained fire data
    var contained_fire_url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Archived_Wildfire_Perimeters2/FeatureServer/0/query?where=GDB_TO_DATE%20%3E%3D%20TIMESTAMP%20'${date_start}%2000%3A00%3A00'%20AND%20GDB_TO_DATE%20%3C%3D%20TIMESTAMP%20'${date_end}%2000%3A00%3A00'&outFields=*&outSR=4326&f=json`;
    // var contained_fires = [];
    d3.json(contained_fire_url).then(function (data) {
        console.log(`Contained Fires - testing:${data.features.length}`);
        // console.log(`testing length: ${data.features[0].geometry.rings[0][0][1]}`);
        // console.log(response.features[1].geometry.rings[0][0]);
        for (var i = 0; i < data.features.length; i++) {
            try {
                // console.log(data.features[i].geometry.rings[0][0]);
                contained_fires.push(
                    L.circle([data.features[i].geometry.rings[0][0][1], data.features[i].geometry.rings[0][0][0]], { radius: 20000 })
                )
            }
            catch (err) {
                console.log("no contained fires");
            }

        }
        console.log(contained_fires.length);

        // creating contained fire layer
        var containedFireLayer = L.layerGroup(contained_fires);

        if (containedFireLayer) { containedFireLayer.remove(); }

        makeMap(containedFireLayer);
    })


}


// slider
// =======================================================================

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

// Create a new date from a string, return as a timestamp.
// source: https://refreshless.com/nouislider/examples/
function timestamp(str) {
    return new Date(str).getTime();
}

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
    start: timestamp('2020-01-02'),

    // No decimals
    format: wNumb({
        decimals: 0
    })
});


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
    slider_div.attr("current_time", date_select);
    updateSlider(date_select);

});

var slider_div = d3.select("#slider-date");

// allowing user to use keyboard to change slider
dateSlider.noUiSlider.on('change', function (values, handle) {
    var date_select = values[handle];
    //   user date in human readable format
    user_selected_date = timeConverter(date_select / 1000);
    var plus_one_day = parseInt(date_select) + (60 * 60 * 24 * 1000);
    console.log(`new user date: ${user_selected_date}`);
    console.log(`handle_read: ${date_select}`);
    console.log(`testing one day past: ${plus_one_day}`);
    d3.select("#date_select").text(`Date selected: ${user_selected_date}`);
    slider_div.attr("current_time", date_select);
    updateSlider(date_select);
});

// allow dates to change when handle is dragged
dateSlider.noUiSlider.on('slide', function (values, handle) {
    var date_select = values[handle];
    user_selected_date = timeConverter(date_select / 1000);
    d3.select("#date_select").text(`Date selected: ${user_selected_date}`);
    
});
