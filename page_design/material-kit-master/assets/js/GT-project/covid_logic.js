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
    var moment_date = moment(date, 'YYYY-MM-DD');
    var plotly_date = moment_date.format ('M/DD');
    var api_date = moment_date.format ('YYYYMMDD');

    var us_url = 'https://api.covidtracking.com/v1/us/daily.json';
    var us_dates = [];
    var us_cases_all = [];
    var us_cases1 = [];
    var us_cases2 = [];
    // var us_deaths = [];

    d3.json (us_url).then ((response) => {
        for (var x = 0; x < response.length; x++) {
            var date = moment(response[x].date, 'YYYY-MM-DD').format ('M/DD');
            var cases = response[x].positive;
            // var deaths = response[x].death;

            us_dates.push (date);
            us_cases_all.push (cases);
            // us_deaths.push (deaths);
            
            if (response[x].date > api_date) {
                us_cases1.push (cases);
                us_cases2.push (null);
            }

            else if (response[x].date == api_date) {
                var date_index = x;
                var select_cases = response[x].positive;
                var select_deaths = response[x].death;

                us_cases1.push (cases);
                us_cases2.push (null);

                // can probably push to a bootstrap card: https://getbootstrap.com/docs/4.5/components/card/
                // or a jumbotron https://getbootstrap.com/docs/4.5/components/jumbotron/ 
                d3.select ('#us_total_cases').text (select_cases);
                d3.select ('#us_total_deaths').text (select_deaths);
            }

            else {
                us_cases2.push (cases);
                us_cases1.push (null);
            }
        }

        // create arrays for daily increases in cases/deaths
        var all_new_cases = [0];
        var us_new_cases1 = [0];
        var us_new_cases2 = [null];
        // var us_new_deaths = [0];

        for (var x = (us_cases_all.length - 2); x > -1; x--) {
            var case_inc = us_cases_all[x] - us_cases_all[x + 1];
            // var death_inc = us_deaths[x] - us_deaths[x + 1];

            all_new_cases.push (case_inc);
            // us_new_deaths.push (death_inc);

            if (x >= date_index) {
                us_new_cases1.push (case_inc);
                us_new_cases2.push (null);
            }

            else {
                us_new_cases2.push (case_inc);
                us_new_cases1.push (null);
            }
        }

        // create arrays for 7d moving avg for cases/deaths
        var new_cases_avg1 = [];
        var new_cases_avg2 = [];
        // var new_deaths_avg = [];
        var reverse_new_cases = all_new_cases.reverse();

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
            var avg = find_avg (avg_array);

            if (x >= date_index) {
                new_cases_avg1.push (avg);
                new_cases_avg2.push (null);
            }

            else {
                new_cases_avg2.push (avg);
                new_cases_avg1.push (null);
            }
        }

        var reverse_dates = us_dates.reverse();

        var trace1 = {
            x: reverse_dates,
            y: us_new_cases1,
            type: 'bar',
            name: 'new cases',
            marker: {
                color: 'rgba(245, 127, 23, 0.9)'
            }
        };

        var trace2 = {
            x: reverse_dates,
            y: us_new_cases2,
            type: 'bar',
            name: 'new cases',
            showlegend: false,
            marker: {
                color: 'rgba(97, 97, 97, 0.4)'
            }
        };

        var trace3 = {
            x: reverse_dates,
            y: new_cases_avg1,
            type: 'scatter',
            mode: 'lines',
            name: '7-day moving average',
            line: {
                shape: 'spline',
                color: 'rgba(26, 35, 126, 1)'
            }
        };

        var trace4 = {
            x: reverse_dates,
            y: new_cases_avg2,
            type: 'scatter',
            mode: 'lines',
            name: '7-day moving average',
            showlegend: false,
            line: {
                shape: 'spline',
                color: 'rgba(97, 97, 97, 0.4)'
            }
        };

        var trace5 = {
            x: [plotly_date, plotly_date],
            y: [-30, 100000],
            type: 'scatter',
            hoverinfo: 'name',
            mode: 'lines',
            name: 'selected date',
            showlegend: false,
            line: {
                dash: 'dash',
                color: 'grey'
            },
        };

        var us_plot_data = [trace1, trace2, trace3, trace4, trace5];

        var us_plot_layout = {
            title: "daily increase of COVID cases in the US",
            // height: '600',
            // legend/annotation config
            legend: {
                x: 0.5,
                xanchor: 'right',
                y: 0.95
            },
            // showlegend: false,
            hovermode: 'x unified',
            hoverlabel: {bgcolor: 'rgba (255, 255, 255, 0.7'},
            xaxis: {
              title: 'date',
              showgrid: false,
              // spikeline config
              showspikes: true,
              spikemode: 'across',
              spikecolor: 'grey',
              spikedistance: -1,
              spikethickness: 1,
              spikedash: 'dot',
              // tick config
              tickmode: 'auto',
              nticks: 10
            },
            yaxis: {
                range: [0, 80000],
                autorange: false,
                title: '# of cases'
            }
          }

        Plotly.newPlot('us_plot', us_plot_data, us_plot_layout);
    })
}

// create fxn that draws one sparkline, takes state as input
function single_state_fxn(date, state) {

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
        
        // console.log(`total cases today: ${select_cases}, total deaths today: ${select_deaths}, new cases today: ${select_increase}`);
        d3.select ('#total_cases').text(select_cases.toLocaleString('en'));
        d3.select ('#total_deaths').text(select_deaths.toLocaleString('en'));

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

        // fxn for sparkline
        $(function () {
            $(`#state_cases`).sparkline(new_cases_avg, {
                width: '100%',
                height: '35%',
                minSpotColor: false,
                maxSpotColor: false,
                highlightSpotColor: 'red',
                highlightLineColor: 'red'
            });
        });
    });
}

us_fxn ('2020-08-05');
single_state_fxn ('2020-08-05', 'GA');