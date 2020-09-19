// see https://moment.github.io/luxon/docs/manual/parsing.html for luxon parsing docs & accepted formats
var dt = luxon.DateTime;

// create list of 50 states + DC
var state_abbrs = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

// function state_lines_fxn(date) {

//     // format date; end result should be yyyymmdd for API calls
//     var luxon_date = dt.fromISO(date);
//     var api_date = luxon_date.toFormat('yyyyLLdd');
//     var prior_date = luxon_date.plus({ days: -1 }).toFormat('yyyyLLdd');
// }

// create fxn that takes date input
function state_data_fxn() {

    // create empty dict for state data
    var state_cases_totals = {};

    // loop through states, use async-ed fxn to perform API calls accordingly
    for (var x = 0; x < state_abbrs.length; x++) {
        var state = state_abbrs[x];
        state_cases_totals[state] = getStateData(state);
    }

    // state_cases_totals['GA'].then ((data) => (console.log (data)));
    return state_cases_totals;
}

// API call fxn
async function getStateData(state) {
    var case_array = [];
    var state_url = `https://api.covidtracking.com/v1/states/${state}/daily.json`;

    try {
        const response = await d3.json(state_url);
        response.forEach ((data) => {
            case_array.push ({
                date: data.date,
                cases: data.positive,
                deaths: data.death
            });
        })

        return case_array;
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


state_data_fxn();