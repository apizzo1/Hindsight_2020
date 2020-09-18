// see https://moment.github.io/luxon/docs/manual/parsing.html for luxon parsing docs & accepted formats
var dt = luxon.DateTime;

// create fxn that takes date input
function us_cases (date) {

    // format date; end result should be yyyymmdd for API calls
    var luxon_date = dt.fromISO (date);
    var api_date = luxon_date.toFormat ('yyyyLLdd');

    // find total cases in US up to selected date
    var us_url = `https://api.covidtracking.com/v1/us/${api_date}.json`;    

    d3.json (us_url, (response) => {
        var total_cases = response.positive;
        var total_deaths = response.death;

        d3.select ('#us_total_cases').text (total_cases);
        d3.select ('#us_total_deaths').text (total_deaths);

        // find daily increase of cases on selected date
        var prior_date = luxon_date.plus ({days: -1}).toFormat ('yyyyLLdd');
        var prior_us_url = `https://api.covidtracking.com/v1/us/${prior_date}.json`;
        
        d3.json (prior_us_url, (response2) => {
            var new_cases = total_cases - response2.positive;
            var new_deaths = total_deaths - response2.death;

            d3.select ('#us_new_cases').text (new_cases);
            d3.select ('#us_new_deaths').text (new_deaths);
        })
    })
}

function state_cases (date) {
    
    // format date; end result should be yyyymmdd for API calls
    var luxon_date = dt.fromISO (date);
    var api_date = luxon_date.toFormat ('yyyyLLdd');
    var prior_date = luxon_date.plus ({days: -1}).toFormat ('yyyyLLdd');

    var state_url = `https://api.covidtracking.com/v1/states/daily.json`

    var state_abbrs = [];
    var state_cases_totals = [];
    var state_deaths_totals = [];

    var state_cases_prior = [];
    var state_deaths_prior = [];

    d3.json (state_url, (response) => {
        for (var x = 0; x < response.length; x++) {
            if (response[x].date == api_date) {
                var state_abbr = response[x].state;
                var state_cases = response[x].positive;
                var state_deaths = response[x].death;

                state_abbrs.push (state_abbr);
                state_cases_totals.push (state_cases);
                state_deaths_totals.push (state_deaths);
            }

            else if (response[x].date == prior_date) {
                var state_cases = response[x].positive;
                var state_deaths = response[x].death;

                state_cases_prior.push (state_cases);
                state_deaths_prior.push (state_deaths);
            }
        }

        var state_cases_incs = [];
        var state_deaths_incs = [];

        for (var y = 0; y < state_cases_totals.length; y++) {
            state_cases_new = state_cases_totals[y] - state_cases_prior[y];
            state_deaths_new = state_deaths_totals[y] - state_deaths_prior[y];

            state_cases_incs.push (state_cases_new);
            state_deaths_incs.push (state_deaths_new);
        }

        console.log (state_abbrs, state_cases_totals, state_cases_incs);
        console.log (state_deaths_totals, state_deaths_incs);
    })
}

us_cases ('2020-09-05');
state_cases ('2020-09-05'); // only returns a console.log rn