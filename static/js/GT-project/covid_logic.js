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
    if (date < 1579737600000) { var moment_date = moment.unix(1579737600).add(1, 'days'); }
    else { var moment_date = moment.unix(date / 1000); }

    // format date; end result should be yyyymmdd for API calls
    var chart_date = moment_date.format('YYYY-MM-DD');
    var api_date = moment_date.format('YYYYMMDD');

    console.log (chart_date);

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
    var bar_colors = [];
    var line_colors = [];

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

                    alphas.push (0.7);
                    bar_colors.push (am4core.color('#A0A0A0'));
                    line_colors.push (am4core.color('#8D8D8D'));
                }

                else if (response[x].date == api_date) {
                    var date_index = x;
                    var select_cases = response[x].positive;
                    var select_deaths = response[x].death;

                    us_cases1.push(cases);
                    us_cases2.push(null);

                    alphas.push (1.0);
                    bar_colors.push (am4core.color('#F0B27A'));
                    line_colors.push (am4core.color('#1A5276'));

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
                    bar_colors.push (am4core.color('#F0B27A'));
                    line_colors.push (am4core.color('#1A5276'));
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
                'bar_color': bar_colors[us_dates.length - x - 1],
                'line_color': line_colors[us_dates.length - x - 1]
            });
        }

        // console.log (us_data);

        // begin plotting bar/line chart
        am4core.ready(function () {
            
            // amcore theme for animation; removed d/t loading
            // am4core.useTheme(am4themes_animated);
    
            // create XY chart
            var chart = am4core.create("us_plot", am4charts.XYChart);
    
            // add data
            chart.data = us_data;
    
            // create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.title.text = "date";
            dateAxis.renderer.minGridDistance = 50;
            dateAxis.renderer.fullWidthTooltip = true;
    
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "# of cases";
            valueAxis.cursorTooltipEnabled = false;
    
            // create columns for daily new cases
            var case_series = chart.series.push(new am4charts.ColumnSeries());
            case_series.dataFields.valueY = "new_cases";
            case_series.dataFields.dateX = "date";
            case_series.yAxis = valueAxis;
            case_series.columns.template.propertyFields.fill = 'bar_color';
            case_series.columns.template.strokeOpacity = 0;
            case_series.tooltipText = "new cases: {valueY}"
            case_series.strokeWidth = 2;
            case_series.columns.template.propertyFields.fillOpacity = "alpha";
            case_series.name = "daily new cases";
            case_series.showOnInit = true;
    
            // create line for rolling 7-day avg of new cases
            var avg_series = chart.series.push(new am4charts.LineSeries());
            avg_series.dataFields.valueY = "avg_new_cases";
            avg_series.dataFields.dateX = "date";
            avg_series.yAxis = valueAxis;
            avg_series.zIndex = 5;
            avg_series.tooltipText = "7-day moving avg: {valueY}"
            avg_series.strokeWidth = 3;
            avg_series.propertyFields.stroke = "line_color";
            avg_series.name = "7-day moving average";
            avg_series.showOnInit = true;

            // create line for selected date
            // var date_line = chart.series.push(new am4charts.LineSeries());
            // date_line.dataFields.valueY = 100000;
            // date_line.dataFields.dateX = chart_date;
            // date_line.yAxis = valueAxis;
            // date_series.strokeWidth = 2;
            var range = dateAxis.axisRanges.create();
            range.date = new Date(chart_date);
            range.grid.stroke = am4core.color("#5B5B5B");
            range.grid.strokeWidth = 2;
            range.grid.strokeOpacity = 1;
            range.grid.strokeDasharray = 8;

            // add cursor for spikeline & zooming in on bars
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineY.disabled = true;
            chart.cursor.behavior = 'zoomX';
            
            // dateAxis.keepSelection = true;
            // chart.legend = new am4charts.Legend();
    
        });
    })
}

// initialize page
us_fxn('1579651200000');

// listener for slider change will call the us_fxn
dateSlider.noUiSlider.on('change', function (values, handle) {
    us_fxn(values[handle]);
})