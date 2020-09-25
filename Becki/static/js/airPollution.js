
// Initialize list of monitoring stations and states
var Stations = [];
var States = []
var StatesArray = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

// read in station datafile
d3.dsv('|','data/monitoring_site_locations.dat', function(locData){

    // loop through all the keys in the data object
    for (const property in locData) {
        // look for the StationID property
        if (property === 'StationID') {
            // filter the data to only include stations in the US that are currently active
            if (locData['Country'] === 'US' && locData['Status'] === 'Active') {
                // set variable to the value of the StationID key
                var currID = locData['StationID'];
                var currState = locData['State'];
                // var latitude = parseFloat(locData['Lat']);
                // var longitude = parseFloat(locData['Lng']);
                // console.log(`lat = ${latitude}, lng = ${longitude}`);
                // check the arrays for the ID, state, and that the state actually exists in US
                if (!(Stations.includes(currID)) && !(States.includes(currState)) && StatesArray.includes(currState)) {
                    // add the ID to the Stations array
                    Stations.push(currID);
                    // add the state to the States array
                    // States.push(currState);
                }
            }
        }
    }
});
console.log(Stations);


d3.dsv('|', 'data/daily_data_v2.dat', function(pollutData) {
    // console.log(pollutData.length)
    pollutData['Latitude'] = +pollutData['Latitude'];
    pollutData['Longitude'] = +pollutData['Longitude'];

    if (pollutData['Latitude'] > 25.2 && pollutData['Latitude'] < 49 && pollutData['Longitude'] > -124.5 && pollutData['Longitude'] < -67) {
        console.log(pollutData['Latitude'], pollutData['Longitude']);
        console.log(pollutData['Parameter name'] + '=' + pollutData['Value']);
    }
});