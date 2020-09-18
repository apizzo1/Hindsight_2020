// see https://moment.github.io/luxon/docs/manual/parsing.html for luxon parsing docs
var dt = luxon.DateTime;

// create fxn that takes date input
function us_cases (date) {

    // format date; end result should be yyyymmdd for API calls
    var luxon_date = dt.fromISO (date);
    var api_date = luxon_date.toFormat ('yyyyLLdd');

    var prior_date = luxon_date.plus ({days: -1}).toFormat ('yyyyLLdd');

    // total cases in US up to selected date
    var us_total_url = `https://api.covidtracking.com/v1/us/${api_date}.json`;    

    d3.json (us_total_url, (response) => {
        var total_cases = response.positive;
        d3.select ('#us_total_cases').text (total_cases);

        // new case increase on selected date from previous day
        var us_new_url = `https://api.covidtracking.com/v1/us/${prior_date}.json`;
        
        d3.json (us_new_url, (response2) => {
            var new_cases = total_cases - response2.positive;
            d3.select ('#us_new_cases').text (new_cases);
        })
    })

    // new case increase on selected date from previous day
    // var us_new_url = 
}

us_cases ('2020-07-05')