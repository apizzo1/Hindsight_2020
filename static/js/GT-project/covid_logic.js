// fxn for finding avg
function find_avg(array) {
    var sum = 0;
    for (var x = 0; x < array.length; x++) {
        sum += array[x];
    }

    var avg = Math.round(sum / array.length);
    return avg;
}

// set a minimum date (1/13/2020) to accept; use moment.js for date parsing/formatting
var first_date = moment.unix(1578934800);

// define url for US COVID data
// var us_url = 'https://api.covidtracking.com/v2/us/daily.json';
var us_path = '../static/Resources/us_covid_data.csv';

// begin API call
// d3.json(us_url).then((response) => {
d3.csv(us_path).then((response) => {

    // format date; yyyy-mm-dd for plotting, yyyymmdd for API calls; adding/subtracting for chart debugging
    var first_chart_date = first_date.add(1, 'days').format('YYYY-MM-DD');
    var first_api_date = first_date.subtract(1, 'days').format('YYYYMMDD');

    // define blank arrays to push data into
    var us_dates = [];
    var us_cases = [];
    var us_deaths = [];

    // blank arrays for transparency & color settings for plotting
    var alphas = [];
    var bar_colors = [];
    var line_colors = [];

    // begin looping through response
    for (var x = 0; x < response.length; x++) {
        var test_date = moment(response[x].date, 'YYYY-MM-DD')
        var date = test_date.format('M/DD/YY');
        var cases = response[x].positive;
        var deaths = response[x].death;

        // skip over data not in 2020; json data starts at most recent date then backwards
        if (test_date > moment('2020-12-31', 'YYYY-MM-DD')) {
            continue;
        }

        else {
            // push date & total case values to respective arrays
            us_dates.push(date);
            us_cases.push(cases);
            us_deaths.push (deaths);

            // push grayscale colors for initialized graph
            alphas.push(0.8);
            bar_colors.push(am4core.color('#CBCBCB'));
            line_colors.push(am4core.color('#B4B4B4'));

            if (x == 0) {
                // initialize totals to 0
                d3.select('#total_cases').text("0");
                d3.select('#total_deaths').text("0");
            }
        }
    }

    // create arrays for daily increases in cases/deaths; start w/ 0 to keep array length the same
    var new_cases = [0];
    // var us_new_deaths = [0];

    // loop through cases, calculate case increases
    for (var x = (us_cases.length - 2); x > -1; x--) {
        var case_inc = us_cases[x] - us_cases[x + 1];
        // var death_inc = us_deaths[x] - us_deaths[x + 1];

        new_cases.push(case_inc);
        // us_new_deaths.push (death_inc);
    }

    // create arrays for 7d moving avg for cases/deaths
    var new_cases_avg = [];
    // var new_deaths_avg = [];

    var reverse_new_cases = new_cases.reverse();

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

        new_cases_avg.push(avg);
    }

    // zip data together for plotting via backwards loop
    var us_data = [];

    for (var x = us_dates.length - 1; x > -1; x--) {
        us_data.push({
            'date': us_dates[x],
            'new_cases': new_cases[x],
            'avg_new_cases': new_cases_avg[us_dates.length - x - 1],
            'alpha': alphas[x],
            'bar_color': bar_colors[x],
            'line_color': line_colors[x],
        });
    }

    // begin plotting bar/line chart

    // amcore theme for animation; removed d/t loading
    // am4core.useTheme(am4themes_animated);

    // create XY chart
    var chart = am4core.create("us_plot", am4charts.XYChart);

    // add data
    chart.data = us_data;

    // create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.title.text = "date";
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.fullWidthTooltip = true;
    dateAxis.renderer.grid.template.disabled = true;

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
    case_series.tooltip.pointerOrientation = 'right';
    case_series.columns.template.tooltipY = am4core.percent(50);
    // case_series.tooltip.dy = 10;

    // create line for rolling 7-day avg of new cases
    var avg_series = chart.series.push(new am4charts.LineSeries());
    avg_series.dataFields.valueY = "avg_new_cases";
    avg_series.dataFields.dateX = "date";
    avg_series.yAxis = valueAxis;
    avg_series.zIndex = 5;
    avg_series.tooltipText = "7-day moving avg: {valueY}"
    avg_series.strokeWidth = 3;
    avg_series.propertyFields.stroke = "line_color";
    avg_series.propertyFields.fill = "line_color";
    avg_series.name = "7-day moving average";
    avg_series.showOnInit = true;
    avg_series.tooltip.pointerOrientation = 'right';
    // avg_series.tooltip.dy = -50;

    // create line for selected date
    var range = dateAxis.axisRanges.create();
    range.date = new Date(first_chart_date);
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

    // fxn called when slider is moved
    function covid_change(new_date) {
        if (new_date < 1579737600000) { var moment_date = moment.unix(1579737600); }
        else { var moment_date = moment.unix(new_date / 1000); }

        var chart_date = moment_date.add(1, 'days').format('YYYY-MM-DD');
        var select_date = moment_date.subtract(1, 'days').format('YYYY-MM-DD');

        var new_alphas = [];
        var new_bar_colors = [];
        var new_line_colors = [];

        for (var x = 0; x < us_dates.length; x++) {
            var loop_date = moment(us_dates[x], 'M/DD/YY').format('YYYY-MM-DD');

            // push grayscale colors for values after selected date
            if (loop_date > select_date) {
                new_alphas.push(0.8);
                new_bar_colors.push(am4core.color('#CBCBCB'));
                new_line_colors.push(am4core.color('#B4B4B4'));
            }

            // isolate totals to date on selected date
            else if (loop_date == select_date) {

                var select_cases = us_cases[x];
                var select_deaths = us_deaths[x];

                // push brighter colors for values before selected date
                new_alphas.push(1.0);
                new_bar_colors.push(am4core.color('#F0B27A'));
                new_line_colors.push(am4core.color('#1A5276'));

                // push select values to HTML
                try {
                    d3.select('#total_cases').text(Number(select_cases).toLocaleString('en'));
                    d3.select('#total_deaths').text(Number(select_deaths).toLocaleString('en'));
                }

                catch (err) {
                    d3.select('#total_cases').text("0");
                    d3.select('#total_deaths').text("0");
                }
            }

            else {
                new_alphas.push(1.0);
                new_bar_colors.push(am4core.color('#F0B27A'));
                new_line_colors.push(am4core.color('#1A5276'));
            }
        }
        
        // change highlighted date to slider date
        range.date = new Date(chart_date);

        // re-plot data to update colors
        var new_us_data = [];

        for (var x = us_dates.length - 1; x > -1; x--) {
            new_us_data.push({
                'date': us_dates[x],
                'new_cases': new_cases[x],
                'avg_new_cases': new_cases_avg[us_dates.length - x - 1],
                'alpha': new_alphas[x],
                'bar_color': new_bar_colors[x],
                'line_color': new_line_colors[x]
            });
        }

        chart.data = '';
        chart.data = new_us_data;
    }

    // listener for slider change will call the us_fxn
    dateSlider.noUiSlider.on('change', function (values, handle) {
        covid_change (values[handle]);
    })
})