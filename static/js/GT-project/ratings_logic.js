// create fxn to output dis/approval line graph, takes date as input
function approval_fxn(date) {

    // convert date to moment.js object
    var date_moment = moment.unix(date/1000).add(1, 'days');
    var chart_date = date_moment.format ('M/DD/YY');

    // gather dis/approval data from https://projects.fivethirtyeight.com/trump-approval-ratings/
    var approval_csv = 'https://projects.fivethirtyeight.com/trump-approval-data/approval_topline.csv';
    d3.csv(approval_csv).then((response) => {

        // create blank arrays; divide values for before/after selected date to plot in different colors
        var approvals1 = [];
        var disapprovals1 = [];
        var approvals2 = [];
        var disapprovals2 = [];

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
                    // approvals1.push(approval);
                    // disapprovals1.push(disapproval);

                    // approvals2.push(null);
                    // disapprovals2.push(null);

                    a_colors.push (am4core.color('green'));
                    d_colors.push (am4core.color('red'));
                }

                else if (poll_date_moment > date_moment) {
                    // approvals2.push(approval);
                    // disapprovals2.push(disapproval);

                    // approvals1.push(null);
                    // disapprovals1.push(null);
                    
                    a_colors.push (am4core.color('grey'));
                    d_colors.push (am4core.color('grey'));
                }

                // break the loop once we've reached the end of 2020 data
                if (poll_date == '1/1/2020') {
                    break;
                }
            }
        }

        // reverse date array for plotting
        // var reverse_dates = poll_dates.reverse()

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
            dateAxis.title.text = "date";
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
            // approval_series.name = "7-day moving average";
            approval_series.showOnInit = true;
            approval_series.tooltip.pointerOrientation = 'left';

            var disapproval_series = chart.series.push(new am4charts.LineSeries());
            disapproval_series.dataFields.valueY = "disapprovals";
            disapproval_series.dataFields.dateX = "date";
            disapproval_series.yAxis = valueAxis;
            disapproval_series.zIndex = 5;
            disapproval_series.tooltipText = "disapproval: {valueY}%"
            disapproval_series.strokeWidth = 2;
            disapproval_series.propertyFields.stroke = "d_color";
            disapproval_series.propertyFields.fill = "d_color";
            // disapproval_series.name = "7-day moving average";
            disapproval_series.showOnInit = true;
            disapproval_series.tooltip.pointerOrientation = 'left';

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

        // create plotly object
        var trace1 = {
            x: reverse_dates,
            y: approvals1.reverse(),
            type: 'scatter',
            mode: 'lines',
            name: 'approval',
            line: {
                shape: 'spline',
                color: 'green'
            }
        };

        var trace2 = {
            x: reverse_dates,
            y: approvals2.reverse(),
            type: 'scatter',
            mode: 'lines',
            name: 'approval',
            showlegend: false,
            line: {
                shape: 'spline',
                color: 'grey'
            }
        };

        var trace3 = {
            x: reverse_dates,
            y: disapprovals1.reverse(),
            type: 'scatter',
            mode: 'lines',
            name: 'disapproval',
            line: {
                shape: 'spline',
                color: 'red'
            }
        };

        var trace4 = {
            x: reverse_dates,
            y: disapprovals2.reverse(),
            type: 'scatter',
            mode: 'lines',
            name: 'disapproval',
            showlegend: false,
            line: {
                shape: 'spline',
                color: 'grey'
            }
        };

        var trace5 = {
            x: [plotly_date, plotly_date],
            y: [30, 70],
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

        var plotly_data = [trace1, trace2, trace3, trace4, trace5];

        var plotly_layout = {
            // title: "president trump's 2020 approval ratings",
            height: '315',
            // legend/annotation config
            // legend: {'orientation': 'h'},
            showlegend: false,
            hovermode: 'x unified',
            hoverlabel: {bgcolor: 'rgba (255, 255, 255, 0.7'},
            margin: {t: '20', l: '45', r: '15'},
            annotations: [
                {
                  x: "1/29",
                  y: "56",
                  text: '% disapproval',
                  font: {color: 'red'},
                  showarrow: false
                },
                {
                  x: "1/29",
                  y: "46",
                  text: '% approval',
                  font: {color: 'green'},
                  showarrow: false
                }
              ],
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
                range: [38, 58],
                autorange: false,
                title: '% approval/disapproval'
            }
          }

        Plotly.newPlot('approval_plot', plotly_data, plotly_layout);
    })
}

// initialize graph
approval_fxn ('1577880000000');

// call fxn w/ listener whenever slider changes
dateSlider.noUiSlider.on('change', function (values, handle) {
    approval_fxn (values[handle]);
})