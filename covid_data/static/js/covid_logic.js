// see https://moment.github.io/luxon/docs/manual/parsing.html for luxon parsing docs & accepted formats
var dt = luxon.DateTime;

// create fxn that takes date input
function us_cases (date) {

    // format date; end result should be yyyymmdd for API calls
    var luxon_date = dt.fromISO (date);
    var api_date = luxon_date.toFormat ('yyyyLLdd');

    var us_url = 'https://api.covidtracking.com/v1/us/daily.json';
    var us_dates = [];
    var us_cases = [];
    var us_deaths = [];
    var us_new_cases = [];
    var us_new_deaths = [];

    d3.json (us_url, (response) => {
        for (var x = 0; x < response.length; x++) {
            var date = dt.fromISO (response[x].date).toFormat ('yyyy-LL-dd');
            var cases = response[x].positive;
            var deaths = response[x].death;

            us_dates.push (date);
            us_cases.push (cases);
            us_deaths.push (deaths);
        

            if (response[x].date == api_date) {
                var select_cases = response[x].positive;
                var select_deaths = response[x].death;

                d3.select ('#us_total_cases').text (select_cases);
                d3.select ('#us_total_deaths').text (select_deaths);
            }
        }
        
        for (var x = 0; x < (us_cases.length - 1); x++) {
            var case_inc = us_cases[x] - us_cases[x + 1];
            var death_inc = us_deaths[x] - us_deaths[x + 1];

            us_new_cases.push (case_inc);
            us_new_deaths.push (death_inc);
        }

        us_new_cases.push (0);
        us_new_deaths.push (0);

        console.log (us_new_deaths);

        var ctx = document.getElementById('us_cases_chart').getContext('2d');
        var test_chart = new Chart (ctx, {
            type: 'bar',
            data: {
                labels: state_abbrs, 
                datasets: [{
                    label: 'total cases',
                    data: state_cases_totals
                }]
            },
            options: {},
            lineAtIndex: [2,4]
        });
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

// taken from https://stackoverflow.com/questions/30256695/chart-js-drawing-an-arbitrary-vertical-line
const verticalLinePlugin = {
    getLinePosition: function (chart, pointIndex) {
        const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
        const data = meta.data;
        return data[pointIndex]._model.x;
    },
    renderVerticalLine: function (chartInstance, pointIndex) {
        const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
        const scale = chartInstance.scales['y-axis-0'];
        const context = chartInstance.chart.ctx;
  
        // render vertical line
        context.beginPath();
        context.strokeStyle = '#ff0000';
        context.moveTo(lineLeftOffset, scale.top);
        context.lineTo(lineLeftOffset, scale.bottom);
        context.stroke();
  
        // write label
        context.fillStyle = "#ff0000";
        context.textAlign = 'center';
        context.fillText('MY TEXT', lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
    },
  
    afterDatasetsDraw: function (chart, easing) {
        if (chart.config.lineAtIndex) {
            chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
        }
    }
};
  
Chart.plugins.register(verticalLinePlugin);



us_cases ('2020-09-05');
// state_cases ('2020-09-05'); // only returns a console.log rn