// fxn for finding avg
function find_avg(array) {
    var sum = 0;
    for (var x = 0; x < array.length; x++) {
        sum += array[x];
    }

    var avg = Math.round(sum / array.length);
    return avg;
}

// fxn to output US data that takes date input
function us_fxn(date) {

    // set a minimum date (1/22/2020) to accept; use moment.js for date parsing/formatting
    if (date < 1579651200000) { var moment_date = moment.unix(1579651200).add(1, 'days'); }
    else { var moment_date = moment.unix(date / 1000).add(1, 'days'); }

    // format date; end result should be yyyymmdd for API calls
    var plotly_date = moment_date.format('M/DD');
    var api_date = moment_date.format('YYYYMMDD');

    // define url for US COVID data
    var us_url = 'https://api.covidtracking.com/v1/us/daily.json';

    // define blank arrays to push data into; separate values before & after selected date so they can be different colors when plotted
    var us_dates = [];
    var all_us_cases = [];
    var us_cases1 = [];
    var us_cases2 = [];
    // var us_deaths = [];
    
    // blank arrays for transparency/dashes
    var alphas = [];
    var dashes = [];
    var colors = [];

    // begin API call; all "death" related COVID responses can be uncommented if desired
    d3.json(us_url).then((response) => {
        for (var x = 0; x < response.length; x++) {
            var test_date = moment(response[x].date, 'YYYY-MM-DD')
            var date = test_date.format('M/DD/YY');
            var cases = response[x].positive;
            // var deaths = response[x].death;

            // skip over data not in 2020; json data starts at most recent date then backwards
            if (test_date > moment('2020-12-31', 'YYYY-MM-DD')) {
                continue;
            }

            else {
                // push date & total case values to respective arrays
                us_dates.push(date);
                all_us_cases.push(cases);
                // us_deaths.push (deaths);

                // push case/null values to respective arrays depending on date; isolate values for selected date
                if (response[x].date > api_date) {
                    us_cases1.push(cases);
                    us_cases2.push(null);

                    alphas.push (0.4);
                    dashes.push (8);
                    colors.push (am4core.color('#A0A0A0'));
                }

                else if (response[x].date == api_date) {
                    var date_index = x;
                    var select_cases = response[x].positive;
                    var select_deaths = response[x].death;

                    us_cases1.push(cases);
                    us_cases2.push(null);

                    alphas.push (1.0);
                    dashes.push (0);
                    colors.push (am4core.color('#2471A3'));

                    // push select values to HTML
                    try {
                        d3.select('#total_cases').text(select_cases.toLocaleString('en'));
                        d3.select('#total_deaths').text(select_deaths.toLocaleString('en'));
                    }

                    catch (err) {
                        d3.select('#total_cases').text("No data available until February 9, 2020.");
                        d3.select('#total_deaths').text("No data available until February 9, 2020.");
                    }
                }

                else {
                    us_cases2.push(cases);
                    us_cases1.push(null);

                    alphas.push (1.0);
                    dashes.push (0);
                    colors.push (am4core.color('#2471A3'));
                }
            }
        }

        // create arrays for daily increases in cases/deaths, again separated to dates before/after selected date
        var all_new_cases = [0];
        var us_new_cases1 = [0];
        var us_new_cases2 = [null];
        // var us_new_deaths = [0];

        // loop through cases, calculate case increases, push to respective arrays
        for (var x = (all_us_cases.length - 2); x > -1; x--) {
            var case_inc = all_us_cases[x] - all_us_cases[x + 1];
            // var death_inc = us_deaths[x] - us_deaths[x + 1];

            all_new_cases.push(case_inc);
            // us_new_deaths.push (death_inc);

            if (x >= date_index) {
                us_new_cases1.push(case_inc);
                us_new_cases2.push(null);
            }

            else {
                us_new_cases2.push(case_inc);
                us_new_cases1.push(null);
            }
        }

        // create arrays for 7d moving avg for cases/deaths
        var new_cases_avg1 = [];
        var new_cases_avg2 = [];
        // var new_deaths_avg = [];
        var all_new_cases_avg = [];

        var reverse_new_cases = all_new_cases.reverse();

        for (var x = (reverse_new_cases.length - 1); x > -1; x--) {
            // create moving mini-array of 7 values (or less if 7 are unavailable)
            var avg_array = [];

            if (x > (reverse_new_cases.length - 8)) {
                avg_array.push(reverse_new_cases[x]); // they all equal 0, so downstream avg calcs are moot
            }
            else {
                for (var y = 0; y < 7; y++) {
                    avg_array.push(reverse_new_cases[x + y]);
                }
            }

            // call "find_avg" fxn to determine average of each mini-array
            var avg = find_avg(avg_array);

            all_new_cases_avg.push (avg);

            if (x >= date_index) {
                new_cases_avg1.push(avg);
                new_cases_avg2.push(null);
            }

            else {
                new_cases_avg2.push(avg);
                new_cases_avg1.push(null);
            }
        }

        // reverse date array for plotting
        var reverse_dates = us_dates.reverse();

        var us_data = [];

        for (var x = 0; x < us_dates.length; x++) {
            us_data.push ({
                'date': reverse_dates[x],
                'new_cases': all_new_cases[us_dates.length - x - 1],
                'avg_new_cases': all_new_cases_avg[x],
                'alpha': alphas[us_dates.length - x - 1],
                'dash': dashes[us_dates.length - x - 1],
                'color': colors[us_dates.length - x - 1]
            });
        }

        console.log (us_data);

        // begin plotting bar/line chart
        am4core.ready(function () {
            
            // amcore theme for animation   
            am4core.useTheme(am4themes_animated);
    
            // create XY chart
            var chart = am4core.create("us_plot", am4charts.XYChart);
    
            // Add data
            chart.data = us_data;
    
            // Create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.title.text = "date";
            dateAxis.renderer.minGridDistance = 50;
            dateAxis.renderer.fullWidthTooltip = true;
    
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "# of cases";

            // Create series
    
            // sea temp series
            var case_series = chart.series.push(new am4charts.ColumnSeries());
            case_series.dataFields.valueY = "new_cases";
            case_series.dataFields.dateX = "date";
            case_series.yAxis = valueAxis;
            case_series.columns.template.propertyFields.fill = 'color';
            case_series.columns.template.strokeOpacity = 0;
            case_series.tooltipText = "new cases: {valueY}"
            case_series.strokeWidth = 2;
            // case_series.columns.template.propertyFields.strokeDasharray = "dash";
            case_series.columns.template.propertyFields.fillOpacity = "alpha";
            case_series.name = "daily new cases";
            case_series.showOnInit = true;
    
            // linregress sea level data
            var avg_series = chart.series.push(new am4charts.LineSeries());
            avg_series.dataFields.valueY = "avg_new_cases";
            avg_series.dataFields.dateX = "date";
            avg_series.yAxis = valueAxis;
            avg_series.tooltipText = "7-day moving avg: {valueY}"
            avg_series.strokeWidth = 2;
            // avg_series.propertyFields.strokeDasharray = "dash";
            avg_series.name = "7-day moving average";
            avg_series.showOnInit = true;
    
            // // Drop-shaped tooltips
            // sea_lvl_ml.tooltip.background.cornerRadius = 20;
            // sea_lvl_ml.tooltip.background.strokeOpacity = 0;
            // sea_lvl_ml.tooltip.pointerOrientation = "vertical";
            // sea_lvl_ml.tooltip.label.minWidth = 40;
            // sea_lvl_ml.tooltip.label.minHeight = 40;
            // sea_lvl_ml.tooltip.label.textAlign = "middle";
            // sea_lvl_ml.tooltip.label.textValign = "middle";
    
            // sea_lvl_linregress.tooltip.background.cornerRadius = 20;
            // sea_lvl_linregress.tooltip.background.strokeOpacity = 0;
            // sea_lvl_linregress.tooltip.pointerOrientation = "vertical";
            // sea_lvl_linregress.tooltip.label.minWidth = 40;
            // sea_lvl_linregress.tooltip.label.minHeight = 40;
            // sea_lvl_linregress.tooltip.label.textAlign = "middle";
            // sea_lvl_linregress.tooltip.label.textValign = "middle";
    
            // Make a panning cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.behavior = "panXY";
            chart.cursor.xAxis = dateAxis;
            chart.cursor = new am4charts.XYCursor();
    
            dateAxis.keepSelection = true;
            chart.legend = new am4charts.Legend();
    
        });

        // // define traces for mixed bar/line graph on plotly
        // var trace1 = {
        //     x: reverse_dates,
        //     y: us_new_cases1,
        //     type: 'bar',
        //     name: 'new cases',
        //     marker: {
        //         color: 'rgba(245, 127, 23, 0.9)'
        //     }
        // };

        // var trace2 = {
        //     x: reverse_dates,
        //     y: us_new_cases2,
        //     type: 'bar',
        //     name: 'new cases',
        //     showlegend: false,
        //     marker: {
        //         color: 'rgba(97, 97, 97, 0.4)'
        //     }
        // };

        // var trace3 = {
        //     x: reverse_dates,
        //     y: new_cases_avg1,
        //     type: 'scatter',
        //     mode: 'lines',
        //     name: '7-day moving average',
        //     line: {
        //         shape: 'spline',
        //         color: 'rgba(26, 35, 126, 1)'
        //     }
        // };

        // var trace4 = {
        //     x: reverse_dates,
        //     y: new_cases_avg2,
        //     type: 'scatter',
        //     mode: 'lines',
        //     name: '7-day moving average',
        //     showlegend: false,
        //     line: {
        //         shape: 'spline',
        //         color: 'rgba(97, 97, 97, 0.4)'
        //     }
        // };

        // var trace5 = {
        //     x: [plotly_date, plotly_date],
        //     y: [-30, 100000],
        //     type: 'scatter',
        //     hoverinfo: 'name',
        //     mode: 'lines',
        //     name: 'selected date',
        //     showlegend: false,
        //     line: {
        //         dash: 'dash',
        //         color: 'grey'
        //     },
        // };

        // var us_plot_data = [trace1, trace2, trace3, trace4, trace5];

        // var us_plot_layout = {
        //     title: "daily increase of COVID cases in the US",
        //     // height: '600',
        //     // legend/annotation config
        //     legend: {
        //         x: 0.5,
        //         xanchor: 'right',
        //         y: 0.95
        //     },
        //     // showlegend: false,
        //     hovermode: 'x unified',
        //     hoverlabel: { bgcolor: 'rgba (255, 255, 255, 0.7' },
        //     xaxis: {
        //         title: 'date',
        //         showgrid: false,
        //         // spikeline config
        //         showspikes: true,
        //         spikemode: 'across',
        //         spikecolor: 'grey',
        //         spikedistance: -1,
        //         spikethickness: 1,
        //         spikedash: 'dot',
        //         // tick config
        //         tickmode: 'auto',
        //         nticks: 10
        //     },
        //     yaxis: {
        //         range: [0, 80000],
        //         autorange: false,
        //         title: '# of cases'
        //     }
        // }

        // Plotly.newPlot('us_plot', us_plot_data, us_plot_layout);
    })
}

// initialize page
us_fxn('1579651200000');

// listener for slider change will call the us_fxn
dateSlider.noUiSlider.on('change', function (values, handle) {
    us_fxn(values[handle]);
})