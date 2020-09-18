baseUrl = "http://www.airnowapi.org/aq/data/?";

var startDate = "2020-09-01";
var endDate = "2020-09-17";

// Pollutant Options:
    // Ozone (O3)
    // PM2.5 (pm25)
    // PM10 (pm10)
    // CO (co)
    // NO2 (no2)
    // SO2 (so2)
// Comma separated list of pollutant short codes in parenthesis above
var pollutants = "PM25";
var borders = "-128.778687,24.634217,-66.552124,49.913868";
var outputFormat = "application/json"

// current URL is too many queries (limit = 500/hour)
queryUrl = `${baseUrl}startDate=${startDate}T00&endDate=${endDate}T02&parameters=${pollutants}&BBOX=${borders}&dataType=B&format=${outputFormat}&verbose=0&nowcastonly=0&API_KEY=${AirNow_API_Key}`