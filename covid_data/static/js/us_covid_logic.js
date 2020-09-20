// see https://moment.github.io/luxon/docs/manual/parsing.html for luxon parsing docs & accepted formats
var dt = luxon.DateTime;

// fxn for finding avg
function find_avg (array) {
    var sum = 0;
    for (var x = 0; x < array.length; x++) {
        sum += array[x];
    }

    var avg = Math.round (sum / array.length);
    return avg;
}

// fxn to output US data that takes date input
function us_fxn (date) {

    // format date; end result should be yyyymmdd for API calls
    var luxon_date = dt.fromISO (date);
    var api_date = luxon_date.toFormat ('yyyyLLdd');

    var us_url = 'https://api.covidtracking.com/v1/us/daily.json';
    var us_dates = [];
    var us_cases = [];
    var us_deaths = [];

    d3.json (us_url).then ((response) => {
        for (var x = 0; x < response.length; x++) {
            var date = dt.fromISO (response[x].date).toFormat ('LL-dd-yyyy');
            var cases = response[x].positive;
            var deaths = response[x].death;

            us_dates.push (date);
            us_cases.push (cases);
            us_deaths.push (deaths);
        
            if (response[x].date == api_date) {
                var date_index = x;
                var select_cases = response[x].positive;
                var select_deaths = response[x].death;

                d3.select ('#us_total_cases').text (select_cases);
                d3.select ('#us_total_deaths').text (select_deaths);
            }
        }

        // create arrays for daily increases in cases/deaths
        var us_new_cases = [0];
        var us_new_deaths = [0];

        for (var x = (us_cases.length - 2); x > -1; x--) {
            var case_inc = us_cases[x] - us_cases[x + 1];
            var death_inc = us_deaths[x] - us_deaths[x + 1];

            us_new_cases.push (case_inc);
            us_new_deaths.push (death_inc);
        }

        // create arrays for 7d moving avg for cases/deaths
        var new_cases_avg = [];
        var new_deaths_avg = [];
        var reverse_new_cases = us_new_cases.reverse();

        for (var x = (reverse_new_cases.length - 1); x > -1; x--) {
            var avg_array = [];

            if (x > (reverse_new_cases.length - 8)) {
                avg_array.push (reverse_new_cases[x]); // they all equal 0, so downstream avg calcs are moot
            }
            else {
                for (var y = 0; y < 7; y++) {
                    avg_array.push (reverse_new_cases[x + y]);
                }
            }
            
            // console.log (avg_array);
            var avg = find_avg (avg_array);
            new_cases_avg.push (avg);
        }

        var ctx = document.getElementById('us_cases_chart').getContext('2d');
        var cases_chart = new Chart (ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'daily case increase',
                    data: us_new_cases.reverse(),
                    backgroundColor: function (context) {
                        var index = context.dataIndex;
                        return index < (us_new_cases.length - date_index) ? 'rgba(13, 71, 161 , 0.4)'
                        : 'rgba(120, 144, 156, 0.2)';
                    },
                    borderColor: 'grey',
                    order: 1
                // }, { // not sure if i should keep the line or not? chart.js doesn't allow changing the color in the middle
                //     label: '7-day moving average',
                //     data: new_cases_avg,
                //     type: 'line',
                //     pointRadius: 0,
                //     backgroundColor: "rgba(230, 74, 25, 0.1)",
                //     borderColor: "rgba(230, 74, 25, 0.5)",
                //     fill: false,
                //     order: 2
                }], 
                labels: us_dates.reverse(), 
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'date'
                        },
                        ticks: {
                            maxTicksLimit: 15
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'number of cases'
                        },
                        gridLines: {
                            color: "rgba(236, 239, 241, 0.7)"
                        }
                    }]
                }
            },
            lineAtIndex: [(us_dates.length - date_index)]
        });
    })
}

// plugin to create vertical line on chart.js; taken from https://stackoverflow.com/questions/30256695/chart-js-drawing-an-arbitrary-vertical-line
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
        context.strokeStyle = 'grey';
        context.moveTo(lineLeftOffset, scale.top);
        context.lineTo(lineLeftOffset, scale.bottom);
        context.stroke();
  
        // write label
        // context.fillStyle = "black";
        // context.textAlign = 'center';
        // context.fillText('MY TEXT', lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
    },
  
    afterDatasetsDraw: function (chart, easing) {
        if (chart.config.lineAtIndex) {
            chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
        }
    }
};
  
Chart.plugins.register(verticalLinePlugin);

// fxn to 

us_fxn ('2020-08-05');