// see https://moment.github.io/luxon/docs/manual/parsing.html for luxon parsing docs & accepted formats
var dt = luxon.DateTime;

// create list of 50 states + DC
var state_abbrs = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

function state_lines_fxn(date) {

    // format date; end result should be yyyymmdd for API calls
    var luxon_date = dt.fromISO(date);
    var api_date = luxon_date.toFormat('yyyyLLdd');
    // var prior_date = luxon_date.plus({ days: -1 }).toFormat('yyyyLLdd');

    var state_data = state_data_fxn();

    state_abbrs.forEach ((state) => {
        state_data[state].then ((response) => {
            
            var case_array = [];
            for (var x = (response.length - 1); x > 0; x--) {
                case_array.push (response[x]['cases'])
                if (response[x]['date'] == api_date) {
                    break
                }
            }

            var case_increases = [];
            for (var x = (case_array.length - 1); x > 0; x--) {
                var increase = case_array[x] - case_array[x - 1];
                case_increases.push (increase);
            }

            d3.select ('#state_cases').append ('span').classed (`${state}spark`, true);

            // fxn for sparkline
            $(function() {
                $(`.${state}spark`).sparkline(case_increases.reverse(), {
                    width: '70px',
                    height: '40px',
                    minSpotColor: false,
                    maxSpotColor: false,
                    highlightSpotColor: 'red',
                    highlightLineColor: 'red'
                });
            });

            // console.log (state, case_array);
            // d3.select ('#state_cases')
            // .selectAll ()
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

    // state_cases_totals['GA'].then ((data) => (console.log (data)));
    return state_data;
}

// API call fxn
async function getStateData(state) {
    var state_data = [];
    var state_url = `https://api.covidtracking.com/v1/states/${state}/daily.json`;

    try {
        const response = await d3.json(state_url);
        response.forEach ((data) => {
            state_data.push ({
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



state_lines_fxn('2020-05-15');

