// added url restriction to allow API key to work with Heroku only
var API_KEY = "pk.eyJ1IjoiYXBpenpvMSIsImEiOiJja2Z1NHg4OXkwZnU5MnVzOW84bGFjd3drIn0.BjLNMe6XzDecA7hN8NEgGg"
// add light tile layer 
var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
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
// source: https://leafletjs.com/examples/choropleth/
function style(feature) {
    return {
        fillColor: "white",
        weight: 2,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.1
    };
}

// variable initialize
var datetoPass;
var map_add_counter = 0;
var contained_fires = [];
var active_fires = [];
var total_active_fires = [];
var protestMarkers_heat = [];
var protest_icons = [];
var slider_div = d3.select("#slider-date");
var dateSlider = document.getElementById('slider-date');
slider_div.attr("current_time", 1577854861000);
d3.select("#date_select").text(`Date selected: January 1, 2020`);
var stategeoJson;
var map_component = d3.select('#map');
map_component.attr("state_name", "None");
var contained_fires_counter = 0;
var active_fires_counter = 0;
var protest_counter = 0;
var state = null;
var compare_coords = [];
var compare_coords_active_fire = [];
var compare_coords_protests = [];
// map layer groups 
var containedFireLayer = new L.LayerGroup();
var activeFireLayer = new L.LayerGroup();
var protestIconLayer = new L.LayerGroup();
var heat = new L.LayerGroup();

// set basemaps
var baseMaps = {
    Light: light,
    Dark: grayscale
};

// set overlay maps
var overlayMaps = {
    "Active Fires": activeFireLayer,
    "Fires Contained": containedFireLayer,
    Protests: protestIconLayer,
    "Protests heat map": heat
};

// / create map object
var myMap = L.map("map", {
    // center of the United States
    center: [39.8, -98.6],
    zoom: 4,
    layers: [light, activeFireLayer]
});

// adding layer control to map
var layerControl = L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);;

// contained fire icon
var contained_fire_icon = L.divIcon({
    html: '<i class="fas fa-fire-extinguisher fa-lg"></i>',
    iconSize: [20, 20],
    className: 'containedFireIcon'
});

// active fire icon
var fire_icon = L.divIcon({
    html: '<i class="fas fa-fire fa-lg"></i>',
    iconSize: [20, 20],
    className: 'fireIcon'
});

// protest icon
var protest_icon = L.divIcon({
    html: '<i class="fas fa-bullhorn fa-lg"></i>',
    iconSize: [20, 20],
    className: 'protestIcon'
});

// call init function when page loads with 1/1/20
init(1577923200000);

function init(date) {
    // set date to pass to other functions (from slider handle read)
    datetoPass = date;

    // clear existing layers
    containedFireLayer.clearLayers();
    activeFireLayer.clearLayers();
    heat.clearLayers();
    protestIconLayer.clearLayers();

    // clearing previous contained fire data
    contained_fires.length = 0;
    compare_coords.length = 0;
    // clearing active fire 
    compare_coords_active_fire.length = 0;

    // clearing protest data
    compare_coords_protests.length = 0;

    // convert date for use in contained fire API call
    date_start = moment.unix(date / 1000).format('YYYYMMDD');

    // add one day to handle slider for use in contained fire API call
    var plus_one_day = parseInt(date) + (60 * 60 * 24 * 1000);
    date_end = moment.unix(plus_one_day / 1000).format('YYYY-MM-DD');

    // clearing active fire data
    active_fires.length = 0;

    // convert date into csv date format
    var fire_csv_date = moment.unix(date / 1000).format('YYYY/MM/DD');


    // Bring in fire data
    d3.csv("../static/Resources/2020_fires.csv").then(function (fire_data) {
        // filter for user selected date
        var contained_fire_markers;

        // filter for fires contained on user selected date
        // source: https://stackoverflow.com/questions/23156864/d3-js-filter-from-csv-file-using-multiple-columns
        var filteredContained_Fire_Data = fire_data.filter(function (contained_fires_csv_data) {
            if (contained_fires_csv_data["ContainmentDate"] == fire_csv_date) {
                return contained_fires_csv_data;
            }
        })

        for (var i = 0; i < filteredContained_Fire_Data.length; i++) {
            // assign latitude and longitudes for each contained fire and change from string to float
            var contained_fire_lat = parseFloat(filteredContained_Fire_Data[i].Y);
            var contained_fire_lng = parseFloat(filteredContained_Fire_Data[i].X);

            // create string arrays to identify duplicate contained fires

            // https://stackoverflow.com/questions/19543514/check-whether-an-array-exists-in-an-array-of-arrays
            var string_unique_contained_fires = JSON.stringify(compare_coords);
            var string_contained_fire_coords = JSON.stringify([contained_fire_lat.toFixed(2), contained_fire_lng.toFixed(2)]);

            // if fire is unique, add to contained fires array, which will be plotted
            if ((string_unique_contained_fires.indexOf(string_contained_fire_coords) == -1)) {
                compare_coords.push([contained_fire_lat.toFixed(2), contained_fire_lng.toFixed(2)]);
                // create popup for contained fires
                var popup_contained_fires = '';

                // if fire name is unknown set to Unnamed and if fire cause general is unknown set to Undetermined
                if ((filteredContained_Fire_Data[i].IncidentName == '') && (filteredContained_Fire_Data[i].FireCauseGeneral == '')) {
                    popup_contained_fires = `Fire Name: Unnamed<br>Fire Category: ${filteredContained_Fire_Data[i].FireCause}<br>Fire Cause: Undetermined`;
                }
                // if fire name is unknown set to Unnamed
                else if (filteredContained_Fire_Data[i].IncidentName == '') {
                    popup_contained_fires = `Fire Name: Unnamed<br>Fire Category: ${filteredContained_Fire_Data[i].FireCause}<br>Fire Cause: ${filteredContained_Fire_Data[i].FireCauseGeneral}`;
                }
                // if fire cause general is unknown set to Undetermined
                else if (filteredContained_Fire_Data[i].FireCauseGeneral == '') {
                    popup_contained_fires = `Fire Name: ${filteredContained_Fire_Data[i].IncidentName}<br>Fire Category: ${filteredContained_Fire_Data[i].FireCause}<br>Fire Cause: Undetermined`;
                }
                else {
                    popup_contained_fires = `Fire Name: ${filteredContained_Fire_Data[i].IncidentName}<br>Fire Category: ${filteredContained_Fire_Data[i].FireCause}<br>Fire Cause: ${filteredContained_Fire_Data[i].FireCauseGeneral}`;
                }
                // push all contained fire points to array and contained fire layer
                contained_fires.push(L.marker([contained_fire_lat, contained_fire_lng], { icon: contained_fire_icon }).bindPopup(popup_contained_fires));
                contained_fire_markers = L.marker([contained_fire_lat, contained_fire_lng], { icon: contained_fire_icon }).bindPopup(popup_contained_fires);
                containedFireLayer.addLayer(contained_fire_markers);
            }
        }

        // filter for fires discovered on user selected date
        var filteredActive_Fire_Data = fire_data.filter(function (active_fires_csv_data) {
            if ((active_fires_csv_data["FireDiscoveryDate"] == fire_csv_date)) {
                return active_fires_csv_data;
            }
        })
        
        for (var i = 0; i < filteredActive_Fire_Data.length; i++) {
            // assign latitude and longitudes for each active fire and change from string to float
            var active_fire_lat = parseFloat(filteredActive_Fire_Data[i].Y);
            var active_fire_lng = parseFloat(filteredActive_Fire_Data[i].X);
            // if no active fires set dummy lat and long
            if (filteredActive_Fire_Data.length == 0) {
                var string_unique_active_fires = JSON.stringify([0, 0]);
            }
            else {
                var active_fire_markers;
                // create string arrays to identify duplicate fires
                var string_unique_active_fires = JSON.stringify(compare_coords_active_fire);
                var string_active_fire_coords = JSON.stringify([active_fire_lat.toFixed(2), active_fire_lng.toFixed(2)]);
                // if fire is unique, add to active fires array, which will be plotted
                // also verifying that active fire does not match any contained fire locations
                if ((string_unique_active_fires.indexOf(string_active_fire_coords) == -1) && (string_unique_contained_fires.indexOf(string_active_fire_coords) == -1)) {
                    compare_coords_active_fire.push([active_fire_lat.toFixed(2), active_fire_lng.toFixed(2)]);
                    // create popup for active fires
                    var popup_active_fires = '';
                    // if fire name is unknown set to Unnamed and if fire cause general is unknown set to Undetermined
                    if ((filteredActive_Fire_Data[i].IncidentName == '') && (filteredActive_Fire_Data[i].FireCauseGeneral == '')) {
                        popup_active_fires = `Fire Name: Unnamed<br>Fire Category: ${filteredActive_Fire_Data[i].FireCause}<br>Fire Cause: Undetermined`;
                    }
                    // if fire name is unknown set to Unnamed
                    else if (filteredActive_Fire_Data[i].IncidentName == '') {
                        popup_active_fires = `Fire Name: Unnamed<br>Fire Category: ${filteredActive_Fire_Data[i].FireCause}<br>Fire Cause: ${filteredActive_Fire_Data[i].FireCauseGeneral}`;
                    }
                    // if fire cause general is unknown set to Undetermined
                    else if (filteredActive_Fire_Data[i].FireCauseGeneral == '') {
                        popup_active_fires = `Fire Name: ${filteredActive_Fire_Data[i].IncidentName}<br>Fire Category: ${filteredActive_Fire_Data[i].FireCause}<br>Fire Cause: Undetermined`;
                    }
                    else {
                        popup_active_fires = `Fire Name: ${filteredActive_Fire_Data[i].IncidentName}<br>Fire Category: ${filteredActive_Fire_Data[i].FireCause}<br>Fire Cause: ${filteredActive_Fire_Data[i].FireCauseGeneral}`;
                    }
                    // push all active fire points to array active fire layer
                    active_fires.push(L.marker([active_fire_lat, active_fire_lng], { icon: fire_icon }).bindPopup(popup_active_fires));
                    active_fire_markers = L.marker([active_fire_lat, active_fire_lng], { icon: fire_icon }).bindPopup(popup_active_fires);
                    activeFireLayer.addLayer(active_fire_markers);
                }
            }
        }

        // clearing previous total fire data
        total_active_fires = active_fires;
        // update index.html with total active fires for selected date
        d3.select(".total_active_fires").text(total_active_fires.length);

        // update index.html with total contained fires for selected date
        d3.select(".total_containted_fires").text(contained_fires.length);

        // protest data

        // clearing previous protest data
        protestMarkers_heat.length = 0;
        protest_icons.length = 0;

        // convert date into csv date format
        var csv_date = moment.unix(date / 1000).format('DD-MMM-YYYY');

        //  Bring in protest data
        d3.csv("../static/Resources/USA_2020_Sep19.csv").then(function (data) {
            // filter for user selected date
            var protest_marker;

            // source: https://stackoverflow.com/questions/23156864/d3-js-filter-from-csv-file-using-multiple-columns
            var filteredData = data.filter(function (d) {
                if (d["EVENT_DATE"] == csv_date) {
                    return d;
                }
            })

            for (var i = 0; i < filteredData.length; i++) {

                // create string arrays to identify duplicate protests
                var string_unique_protests = JSON.stringify(compare_coords_protests);
                var string_protests_locations = JSON.stringify([filteredData[i]["LATITUDE"], filteredData[i]["LONGITUDE"]]);
                // if protest is unique, add to protest array, which will be plotted
                if (string_unique_protests.indexOf(string_protests_locations) == -1) {
                    compare_coords_protests.push([filteredData[i]["LATITUDE"], filteredData[i]["LONGITUDE"]]);

                    // push protest markers to arrays (one for heat map, one for counting protests, and one for plotting layer)
                    protestMarkers_heat.push(
                        ([filteredData[i]["LATITUDE"], filteredData[i]["LONGITUDE"]]));

                    protest_icons.push(
                        L.marker([filteredData[i]["LATITUDE"], filteredData[i]["LONGITUDE"]], { icon: protest_icon }).bindPopup(`Protest Location: ${filteredData[i]["LOCATION"]}<br>Event Type: ${filteredData[i]["EVENT_TYPE"]}`));
                    protest_marker = L.marker([filteredData[i]["LATITUDE"], filteredData[i]["LONGITUDE"]], { icon: protest_icon }).bindPopup(`Protest Location: ${filteredData[i]["LOCATION"]}<br>Event Type: ${filteredData[i]["EVENT_TYPE"]}`);
                    protestIconLayer.addLayer(protest_marker);
                }

            }

            // heat map information
            var heat_layer = L.heatLayer(protestMarkers_heat, {
                radius: 35,
                blur: 15,
            });

            // add heat layer to map
            heat.addLayer(heat_layer);

            // update index.html with total protests for selected date
            d3.select(".total_protests").text(protestMarkers_heat.length);

            // call function to update state info row when new date is selected
            if (d3.select(".state")._groups[0][0].innerText != "State") {
                dateUpdate(d3.select(".state")._groups[0][0].innerText);
            }

            // make map interactive 
            // source: https://leafletjs.com/examples/choropleth/

            // function to zoom into a state when the user clicks the state
            function zoomToFeature(e) {

                // reset counters;
                contained_fires_counter = 0;
                active_fires_counter = 0;
                protest_counter = 0;
                // zoom to map
                myMap.fitBounds(e.target.getBounds());
                // update html state name
                state = e.target.feature.properties.name;
                map_component.attr("state_name", state);

                // call state functions

                stateUnemployment(state, datetoPass);
                single_state_fxn(state, datetoPass);
                optionChanged(state, datetoPass);

                // getting state polygon coordinates using state dictionary
                var state_index = state_dict[state];
                var polygon_coords = statesData.features[state_index].geometry.coordinates;
                var final_coords = [];
                // switching lat and long for final coords
                for (i = 0; i < polygon_coords[0].length; i++) {
                    var update_coord = [polygon_coords[0][i][1], polygon_coords[0][i][0]];
                    final_coords.push(update_coord);
                }

                var state_check = L.polygon(final_coords);

                // find markers within clicked state 
                // contained fires
                for (var i = 0; i < contained_fires.length; i++) {
                    // special requirements for Alaska (multipolygon)
                    if (state_index == 1) {
                        if (contained_fires[i]._latlng.lat > 52) {
                            contained_fires_counter = contained_fires_counter + 1;
                        }
                    }
                    // special requirements for Hawaii (multipolygon)
                    if (state_index == 11) {
                        if ((contained_fires._latlng.lng < -126) && (contained_fires._latlng.lat < 50)) {
                            contained_fires_counter = contained_fires_counter + 1;
                        }
                    }
                    // special requirements for Michigan (multipolygon)
                    if (state_index == 22) {
                        if ((contained_fires[i]._latlng.lng > -87) && (contained_fires[i]._latlng.lat > 41.8) && (contained_fires[i]._latlng.lng < -82.5)) {
                            contained_fires_counter = contained_fires_counter + 1;
                        }
                    }
                    // all other states check
                    else {
                        var marker_inside_polygon = state_check.contains(contained_fires[i].getLatLng());

                        if (marker_inside_polygon) {
                            contained_fires_counter = contained_fires_counter + 1;
                        }
                    }
                }

                // active fires
                for (var i = 0; i < total_active_fires.length; i++) {
                    if (state_index == 1) {
                        if (total_active_fires[i]._latlng.lat > 52) {
                            active_fires_counter = active_fires_counter + 1;
                        }
                    }
                    if (state_index == 11) {
                        if ((total_active_fires._latlng.lng < -126) && (total_active_fires._latlng.lat < 50)) {
                            active_fires_counter = active_fires_counter + 1;
                        }
                    }

                    if (state_index == 22) {
                        if ((total_active_fires[i]._latlng.lng > -87) && (total_active_fires[i]._latlng.lat > 41.8) && (total_active_fires[i]._latlng.lng < -82.5)) {
                            active_fires_counter = active_fires_counter + 1;
                        }
                    }

                    else {
                        var marker_inside_polygon1 = state_check.contains(total_active_fires[i].getLatLng());
                        if (marker_inside_polygon1) {
                            active_fires_counter = active_fires_counter + 1;
                        }
                    }
                }

                // protest data
                for (var i = 0; i < protest_icons.length; i++) {
                    if (state_index == 1) {
                        if (protest_icons[i]._latlng.lat > 52) {
                            protest_counter = protest_counter + 1;
                        }
                    }
                    if (state_index == 11) {
                        if ((protest_icons._latlng.lng < -126) && (protest_icons._latlng.lat < 50)) {
                            protest_counter = protest_counter + 1;
                        }
                    }

                    if (state_index == 22) {
                        if ((protest_icons[i]._latlng.lng > -87) && (protest_icons[i]._latlng.lat > 41.8) && (protest_icons[i]._latlng.lng < -82.5)) {
                            protest_counter = protest_counter + 1;
                        }
                    }

                    else {
                        var marker_inside_polygon2 = state_check.contains(protest_icons[i].getLatLng());
                        if (marker_inside_polygon2) {
                            protest_counter = protest_counter + 1;
                        }
                    }
                }

                // update the state information on html when state is clicked
                d3.select(".contained_fires").text(contained_fires_counter);
                d3.select(".active_fires").text(active_fires_counter);
                d3.select(".protests").text(protest_counter);
                d3.select(".state").text(state);
            }

            // function to update state information when new date is clicked
            function dateUpdate(state) {

                // reset counters;
                contained_fires_counter = 0;
                active_fires_counter = 0;
                protest_counter = 0;

                // getting state polygon coordinates using state dictionary
                var state_index = state_dict[state];

                var polygon_coords = statesData.features[state_index].geometry.coordinates;
                var final_coords = [];
                // switching lat and long for final coords
                for (i = 0; i < polygon_coords[0].length; i++) {
                    var update_coord = [polygon_coords[0][i][1], polygon_coords[0][i][0]];
                    final_coords.push(update_coord);
                }

                var state_check = L.polygon(final_coords);

                // find markers within clicked state 
                // contained fires
                for (var i = 0; i < contained_fires.length; i++) {
                    // special requirements for Alaska (multipolygon)
                    if (state_index == 1) {
                        if (contained_fires[i]._latlng.lat > 52) {
                            contained_fires_counter = contained_fires_counter + 1;
                        }
                    }
                    // special requirements for Hawaii (multipolygon)
                    if (state_index == 11) {
                        if ((contained_fires._latlng.lng < -126) && (contained_fires._latlng.lat < 50)) {
                            contained_fires_counter = contained_fires_counter + 1;
                        }
                    }
                    // special requirements for Michigan (multipolygon)
                    if (state_index == 22) {
                        if ((contained_fires[i]._latlng.lng > -87) && (contained_fires[i]._latlng.lat > 41.8) && (contained_fires[i]._latlng.lng < -82.5)) {
                            contained_fires_counter = contained_fires_counter + 1;
                        }
                    }
                    // all other states check
                    else {
                        var marker_inside_polygon = state_check.contains(contained_fires[i].getLatLng());

                        if (marker_inside_polygon) {
                            contained_fires_counter = contained_fires_counter + 1;
                        }
                    }
                }

                // active fires
                for (var i = 0; i < total_active_fires.length; i++) {
                    if (state_index == 1) {
                        if (total_active_fires[i]._latlng.lat > 52) {
                            active_fires_counter = active_fires_counter + 1;
                        }
                    }
                    if (state_index == 11) {
                        if ((total_active_fires._latlng.lng < -126) && (total_active_fires._latlng.lat < 50)) {
                            active_fires_counter = active_fires_counter + 1;
                        }
                    }

                    if (state_index == 22) {
                        if ((total_active_fires[i]._latlng.lng > -87) && (total_active_fires[i]._latlng.lat > 41.8) && (total_active_fires[i]._latlng.lng < -82.5)) {
                            active_fires_counter = active_fires_counter + 1;
                        }
                    }

                    else {
                        var marker_inside_polygon1 = state_check.contains(total_active_fires[i].getLatLng());
                        if (marker_inside_polygon1) {
                            active_fires_counter = active_fires_counter + 1;
                        }
                    }
                }

                // protest data
                for (var i = 0; i < protest_icons.length; i++) {
                    if (state_index == 1) {
                        if (protest_icons[i]._latlng.lat > 52) {
                            protest_counter = protest_counter + 1;
                        }
                    }
                    if (state_index == 11) {
                        if ((protest_icons._latlng.lng < -126) && (protest_icons._latlng.lat < 50)) {
                            protest_counter = protest_counter + 1;
                        }
                    }

                    if (state_index == 22) {
                        if ((protest_icons[i]._latlng.lng > -87) && (protest_icons[i]._latlng.lat > 41.8) && (protest_icons[i]._latlng.lng < -82.5)) {
                            protest_counter = protest_counter + 1;
                        }
                    }

                    else {
                        var marker_inside_polygon2 = state_check.contains(protest_icons[i].getLatLng());
                        if (marker_inside_polygon2) {
                            protest_counter = protest_counter + 1;
                        }
                    }
                }

                // update the national and state information on html when state is clicked
                d3.select(".contained_fires").text(contained_fires_counter);
                d3.select(".active_fires").text(active_fires_counter);
                d3.select(".protests").text(protest_counter);
            }


            // function when user mouses over feature
            // source:  https://leafletjs.com/examples/choropleth/
            function highlightFeature(e) {
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: 'black',
                    dashArray: '',
                    fillOpacity: 0.3
                });

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
            }

            // function when user mouses out of a feature
            // source: https://leafletjs.com/examples/choropleth/
            function resetHighlight(e) {
                stategeoJson.resetStyle(e.target);
            }


            // use onEachFeature function to call event functions
            // source: https://leafletjs.com/examples/choropleth/
            function onEachFeature(feature, layer) {

                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature,

                });
            }

            // add state boundaries
            // ensure map boundaries only added one time
            if (map_add_counter == 0) {
                // source: https://leafletjs.com/examples/choropleth/
                stategeoJson = L.geoJson(statesData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(myMap);
            }
            map_add_counter = 1;
        })
    })
}




// slider
// =======================================================================

// Create a new date from a string, return as a timestamp.
// source: https://refreshless.com/nouislider/examples/
function timestamp(str) {
    return new Date(str).getTime();
}

// create slider
noUiSlider.create(dateSlider, {
    // Create two timestamps to define a range.
    range: {
        min: timestamp('2020-01-02'),
        max: timestamp('2020-09-12')
    },

    // Steps of one day
    step: 24 * 60 * 60 * 1000,

    //  indicate the handle starting positions.
    start: timestamp('2020-01-02'),

    // No decimals
    format: wNumb({
        decimals: 0
    })
});


// after user selects date with mouse, return date
dateSlider.noUiSlider.on('end', function (values, handle) {

    // using Moment.js for date display
    var date_select = values[handle];
    var display_date_main_page = moment.unix(date_select / 1000).format('MMMM D, YYYY');
    // update date shown on index.html (user date in human readable format)
    d3.select("#date_select").text(`Date selected: ${display_date_main_page}`);
    slider_div.attr("current_time", date_select);

});

// allowing user to use keyboard to change slider
dateSlider.noUiSlider.on('change', function (values, handle) {
    // using Moment.js for date display
    var date_select = values[handle];
    var display_date_main_page = moment.unix(date_select / 1000).format('MMMM D, YYYY');
    // update date shown on index.html (user date in human readable format)
    d3.select("#date_select").text(`Date selected: ${display_date_main_page}`);
    slider_div.attr("current_time", date_select);

    // call map update
    init(date_select);

    // call state functions
    if (!(state === null)) {
        stateUnemployment(state, datetoPass);
        optionChanged(state, datetoPass);
        single_state_fxn(state, datetoPass);
    };
});

// allow dates to change when handle is dragged
dateSlider.noUiSlider.on('slide', function (values, handle) {
    // using Moment.js for date display
    var date_select = values[handle];
    var display_date_main_page = moment.unix(date_select / 1000).format('MMMM D, YYYY');
    // update date shown on index.html (user date in human readable format)
    d3.select("#date_select").text(`Date selected: ${display_date_main_page}`);

});

// create state dictionary for use when user clicks on state (zoomToFeature function)

var state_dict =

{
    "Alabama": 0,
    "Alaska": 1,
    "Arizona": 2,
    "Arkansas": 3,
    "California": 4,
    "Colorado": 5,
    "Connecticut": 6,
    "Delaware": 7,
    "District of Columbia": 8,
    "Florida": 9,
    "Georgia": 10,
    "Hawaii": 11,
    "Idaho": 12,
    "Illinois": 13,
    "Indiana": 14,
    "Iowa": 15,
    "Kansas": 16,
    "Kentucky": 17,
    "Louisiana": 18,
    "Maine": 19,
    "Maryland": 20,
    "Massachusetts": 21,
    "Michigan": 22,
    "Minnesota": 23,
    "Mississippi": 24,
    "Missouri": 25,
    "Montana": 26,
    "Nebraska": 27,
    "Nevada": 28,
    "New Hampshire": 29,
    "New Jersey": 30,
    "New Mexico": 31,
    "New York": 32,
    "North Carolina": 33,
    "North Dakota": 34,
    "Ohio": 35,
    "Oklahoma": 36,
    "Oregon": 37,
    "Pennsylvania": 38,
    "Rhode Island": 39,
    "South Carolina": 40,
    "South Dakota": 41,
    "Tennessee": 42,
    "Texas": 43,
    "Utah": 44,
    "Vermont": 45,
    "Virginia": 46,
    "Washington": 47,
    "West Virginia": 48,
    "Wisconsin": 49,
    "Wyoming": 50,
    "Puerto Rico": 51
};
