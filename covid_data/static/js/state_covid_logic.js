// fxn for finding avg
function find_avg(array) {
    var sum = 0;
    for (var x = 0; x < array.length; x++) {
        sum += array[x];
    }

    var avg = Math.round(sum / array.length);
    return avg;
}

// create list of 50 states + DC
var state_abbrs = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

// create fxn that draws one sparkline, takes state as input
function single_line_fxn(date, state) {

    // format date; end result should be yyyymmdd for API calls
    var moment_date = moment(date, 'YYYY-MM-DD');
    var api_date = moment_date.format('YYYYMMDD');
    // var prior_date = luxon_date.plus({ days: -1 }).toFormat('yyyyLLdd');

    var state_url = `https://api.covidtracking.com/v1/states/${state}/daily.json`;

    var case_array = [];
    var date_array = [];
    var death_array = [];

    d3.json(state_url).then((response) => {
        for (var x = 0; x < response.length; x++) {
            date_array.push(response[x]['date']);
            case_array.push(response[x]['positive']);
            death_array.push(response[x]['death']);

            if (response[x]['date'] == api_date) {
                var select_cases = response[x]['positive'];
                var select_deaths = response[x]['death'];
                var select_index = x;
            }
        }

        var case_increases = [];
        for (var x = (case_array.length - 2); x > -1; x--) {
            var increase = case_array[x] - case_array[x + 1];
            case_increases.push(increase);

            if (x == select_index) {
                var select_increase = increase;
                break;
            }
        }
        
        console.log(`total cases today: ${select_cases}, total deaths today: ${select_deaths}, new cases today: ${select_increase}`);

        // find 7-day moving avgs for a smoother sparkline
        var new_cases_avg = [];
        for (var x = 0; x < case_increases.length; x++) {
            var avg_array = [];
            if (x > (case_increases.length - 8)) {
                for (var y = x; y < (case_increases.length); y++) {
                    avg_array.push(case_increases[y]);
                }
            }
            else {
                for (var y = 0; y < 7; y++) {
                    avg_array.push(case_increases[x + y]);
                }
            }
            var avg = find_avg(avg_array);
            new_cases_avg.push(avg);
        }

        d3.select('#state_cases').append('span').classed(`${state}spark`, true);

        // fxn for sparkline
        $(function () {
            $(`.${state}spark`).sparkline(new_cases_avg, {
                width: '100px',
                height: '75px',
                minSpotColor: false,
                maxSpotColor: false,
                highlightSpotColor: 'red',
                highlightLineColor: 'red'
            });
        });
    });
}

// create fxn that draws sparklines; https://omnipotent.net/jquery.sparkline/#s-docs
function state_lines_fxn(date) {

    // format date; end result should be yyyymmdd for API calls
    var moment_date = moment(date, 'YYYY-MM-DD');
    var api_date = moment_date.format('YYYYMMDD');
    // var prior_date = luxon_date.plus({ days: -1 }).toFormat('yyyyLLdd');

    var state_data = state_data_fxn();

    state_abbrs.forEach((state) => {
        state_data[state].then((response) => {

            var case_array = [];
            for (var x = (response.length - 1); x > 0; x--) {
                case_array.push(response[x]['cases'])
                if (response[x]['date'] == api_date) {
                    break
                }
            }

            var case_increases = [];
            for (var x = (case_array.length - 1); x > 0; x--) {
                var increase = case_array[x] - case_array[x - 1];
                case_increases.push(increase);
            }

            // find 7-day moving avgs for a smoother sparkline
            var new_cases_avg = [];
            for (var x = 0; x < case_increases.length; x++) {
                var avg_array = [];
                if (x > (case_increases.length - 8)) {
                    for (var y = x; y < (case_increases.length); y++) {
                        avg_array.push(case_increases[y]);
                    }
                }
                else {
                    for (var y = 0; y < 7; y++) {
                        avg_array.push(case_increases[x + y]);
                    }
                }
                var avg = find_avg(avg_array);
                new_cases_avg.push(avg);
            }

            d3.select('#state_cases').append('span').classed(`${state}spark`, true);

            // fxn for sparkline
            $(function () {
                $(`.${state}spark`).sparkline(new_cases_avg.reverse(), {
                    width: '70px',
                    height: '40px',
                    minSpotColor: false,
                    maxSpotColor: false,
                    highlightSpotColor: 'red',
                    highlightLineColor: 'red'
                });
            });
        })
    })
}

// create fxn that takes date input
function state_data_fxn() {

    // create empty dict for state data
    var state_data = {};

    // loop through states, use async-ed fxn to perform API calls accordingly
    for (var x = 0; x < state_abbrs.length; x++) {
        var state = state_abbrs[x];
        state_data[state] = getStateData(state);
    }

    return state_data;
}

// API call fxn
async function getStateData(state) {
    var state_data = [];
    var state_url = `https://api.covidtracking.com/v1/states/${state}/daily.json`;

    try {
        const response = await d3.json(state_url);
        response.forEach((data) => {
            state_data.push({
                date: data.date,
                cases: data.positive,
                deaths: data.death
            });
        })

        return state_data;
    }
    catch (err) {
        console.log(err)
    }
}

// state_lines_fxn('2020-08-15');
single_line_fxn('2020-07-14', 'GA');