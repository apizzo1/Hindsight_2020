// create fxn to output dis/approval line graph, takes date as input
function approval_fxn(date) {

    // convert date to moment.js object; add/subtract for charting
    var pre_date_moment = moment.unix(date/1000);
    var chart_date = pre_date_moment.add(1, 'days').format ('M/DD/YY');
    var date_moment = pre_date_moment.subtract(1, 'days');

    // gather dis/approval data from https://projects.fivethirtyeight.com/trump-approval-ratings/
    var approval_csv = 'https://projects.fivethirtyeight.com/trump-approval-data/approval_topline.csv';
    d3.csv(approval_csv).then((response) => {

        // create blank arrays; divide values for before/after selected date to plot in different colors
        var approvals = [];
        var disapprovals = [];
        var a_colors = [];
        var d_colors = [];
        var poll_dates = [];

        // loop through responses, gather dates & approval/disapproval values
        for (var x = 0; x < response.length; x++) {
            var poll_date = response[x].modeldate
            var voter = response[x].subgroup;
            
            var approval = Math.round (response[x].approve_estimate * 10) / 10;
            var disapproval = Math.round (response[x].disapprove_estimate * 10) / 10;

            // isolate aggregate polls
            if (voter == 'All polls') {
                
                // create full array of correctly formatted dates
                var poll_date_moment = moment(poll_date, 'MM/DD/YYYY')
                var poll_date_format = poll_date_moment.format ('M/DD/YY');

                // skip dates after 2020
                if (poll_date_moment > moment('12/31/2020', 'MM/DD/YYYY')) {
                    continue;
                }

                // push 2020 dates & ratings to array
                poll_dates.push(poll_date_format);
                approvals.push (approval);
                disapprovals.push (disapproval);

                // push approval/disapproval values to respective arrays if they're before/after selected date
                if (poll_date_moment <= date_moment) {
                    a_colors.push (am4core.color('green'));
                    d_colors.push (am4core.color('red'));
                }

                else if (poll_date_moment > date_moment) {
                    a_colors.push (am4core.color('#B4B4B4'));
                    d_colors.push (am4core.color('#B4B4B4'));
                }

                // break the loop once we've reached the end of 2020 data
                if (poll_date == '1/1/2020') {
                    break;
                }
            }
        }

        // compile data for plotting
        var poll_data = [];

        for (var x = poll_dates.length - 1; x > -1; x--) {
            poll_data.push ({
                'date': poll_dates[x],
                'approvals': approvals[x],
                'disapprovals': disapprovals[x],
                'a_color': a_colors[x],
                'd_color': d_colors[x]
            });
        }

        // begin plotting bar/line chart
        am4core.ready(function () {
            
            // amcore theme for animation; removed d/t loading
            // am4core.useTheme(am4themes_animated);
    
            // create XY chart
            var chart = am4core.create("approval_plot", am4charts.XYChart);
    
            // add data
            chart.data = poll_data;
    
            // create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            // dateAxis.title.text = "date";
            dateAxis.renderer.minGridDistance = 50;
            dateAxis.renderer.fullWidthTooltip = true;
            dateAxis.renderer.grid.template.disabled = true;
    
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "% approval/disapproval";
            valueAxis.min = 38;
            valueAxis.max = 56;
            valueAxis.cursorTooltipEnabled = false;
    
            // create line for rolling 7-day avg of new cases
            var approval_series = chart.series.push(new am4charts.LineSeries());
            approval_series.dataFields.valueY = "approvals";
            approval_series.dataFields.dateX = "date";
            approval_series.yAxis = valueAxis;
            approval_series.zIndex = 5;
            approval_series.tooltipText = "approval: {valueY}%"
            approval_series.strokeWidth = 2;
            approval_series.propertyFields.stroke = "a_color";
            approval_series.propertyFields.fill = "a_color";
            // approval_series.name = "approval ratings";
            approval_series.showOnInit = true;
            approval_series.tooltip.pointerOrientation = 'right';

            var disapproval_series = chart.series.push(new am4charts.LineSeries());
            disapproval_series.dataFields.valueY = "disapprovals";
            disapproval_series.dataFields.dateX = "date";
            disapproval_series.yAxis = valueAxis;
            disapproval_series.zIndex = 5;
            disapproval_series.tooltipText = "disapproval: {valueY}%"
            disapproval_series.strokeWidth = 2;
            disapproval_series.propertyFields.stroke = "d_color";
            disapproval_series.propertyFields.fill = "d_color";
            // disapproval_series.name = "disapproval ratings";
            disapproval_series.showOnInit = true;
            disapproval_series.tooltip.pointerOrientation = 'right';

            // create line for selected date
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

// create fxn to change displayed getty carousel based on month
function carousel_fxn (date) {

    // convert date from slider to month
    var date_moment = moment.unix(date/1000);
    var month = date_moment.format('MM');

    // define id variable
    var id = `getty_${month}`;

    // display getty carousel w/ ^id
    document.getElementById(id).style.display = 'block';

    // define list of months
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    // loop through months, hide all carousels other than selected one above
    for (var x = 0; x < months.length; x++) {
        var test_id = `getty_${months[x]}`;

        // try/catch since december carousel doesn't exist yet
        try {
            if (test_id != id) {
                document.getElementById(test_id).style.display = 'none';
            }
        }
        catch (err) {
            continue;
        }
    }
}

// initialize approval rating graph
approval_fxn ('1577880000000');

// call fxns w/ listener whenever slider changes
dateSlider.noUiSlider.on('change', function (values, handle) {
    approval_fxn (values[handle]);
    carousel_fxn (values[handle]);
})