// create fxn to output dis/approval line graph, takes date as input
function approval_fxn(date) {

    // convert date to moment.js object
    var date_moment = moment(date, 'MM-DD-YYYY');
    var plotly_date = date_moment.format ('M/DD');

    // gather dis/approval data from https://projects.fivethirtyeight.com/trump-approval-ratings/
    var approval_csv = 'https://projects.fivethirtyeight.com/trump-approval-data/approval_topline.csv';
    d3.csv(approval_csv).then((response) => {

        // create blank arrays; one set of dis/approval for before selected date, another for after so we can have different colors
        var approvals1 = [];
        var disapprovals1 = [];
        var approvals2 = [];
        var disapprovals2 = [];
        var poll_dates = [];

        for (var x = 0; x < response.length; x++) {
            var poll_date = response[x].modeldate
            var voter = response[x].subgroup;
            
            var approval = Math.round (response[x].approve_estimate * 10) / 10;
            var disapproval = Math.round (response[x].disapprove_estimate * 10) / 10;

            // isolate aggregate polls
            if (voter == 'All polls') {
                
                // create full array of correctly formatted dates
                var poll_date_moment = moment(poll_date, 'MM/DD/YYYY')
                var poll_date_format = poll_date_moment.format ('M/DD');
                
                poll_dates.push(poll_date_format);

                if (poll_date_moment <= date_moment) {
                    approvals1.push(approval);
                    disapprovals1.push(disapproval);

                    approvals2.push(null);
                    disapprovals2.push(null);
                }

                else if (poll_date_moment > date_moment) {
                    approvals2.push(approval);
                    disapprovals2.push(disapproval);

                    approvals1.push(null);
                    disapprovals1.push(null);
                }

                // break the loop once we've reached the end of 2020 data
                if (poll_date == '1/1/2020') {
                    break;
                }
            }
        }

        // pull index number of input date
        for (var x = 0; x < poll_dates.length; x++) {
            if (poll_dates[x] == date_moment) {
                var date_index = x;
                break;
            }
        }

        // create chart.js object
        var ctx = document.getElementById('approval_chart').getContext('2d');
        var approval_chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'approval',
                    data: approvals1.reverse(),
                    pointRadius: 0,
                    borderColor: 'green',
                    fill: false
                }, {
                    label: 'approval',
                    data: approvals2.reverse(),
                    type: 'line',
                    pointRadius: 0,
                    borderColor: "grey",
                    fill: false,
                }, {
                    label: 'disapproval',
                    data: disapprovals1.reverse(),
                    type: 'line',
                    pointRadius: 0,
                    borderColor: "red",
                    fill: false,
                }, {
                    label: 'disapproval',
                    data: disapprovals2.reverse(),
                    type: 'line',
                    pointRadius: 0,
                    borderColor: "grey",
                    fill: false,
                }],
                labels: poll_dates.reverse(),
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
                            labelString: '% approval/disapproval'
                        },
                        gridLines: {
                            color: "rgba(236, 239, 241, 0.7)"
                        }
                    }]
                }
            },
            // lineAtIndex: [date_index]
        });

        // create plotly object
        var trace1 = {
            x: poll_dates,
            y: approvals1,
            type: 'scatter',
            mode: 'lines',
            name: 'approval',
            line: {
                shape: 'spline',
                color: 'green'
            }
        };

        var trace2 = {
            x: poll_dates,
            y: approvals2,
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
            x: poll_dates,
            y: disapprovals1,
            type: 'scatter',
            mode: 'lines',
            name: 'disapproval',
            line: {
                shape: 'spline',
                color: 'red'
            }
        };

        var trace4 = {
            x: poll_dates,
            y: disapprovals2,
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
            title: "president trump's 2020 approval ratings",
            height: '600',
            // legend/annotation config
            // legend: {'orientation': 'h'},
            showlegend: false,
            hovermode: 'x unified',
            hoverlabel: {bgcolor: 'rgba (255, 255, 255, 0.7'},
            annotations: [
                {
                  x: "1/18",
                  y: "55",
                  text: '% disapproval',
                  font: {color: 'red'},
                  showarrow: false
                },
                {
                  x: "1/18",
                  y: "44",
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

        Plotly.newPlot('plotly_chart', plotly_data, plotly_layout);
    })
}

// plugin to create vertical line on chart.js; taken from https://stackoverflow.com/questions/30256695/chart-js-drawing-an-arbitrary-vertical-line
const verticalLinePlugin = {
    getLinePosition: function (chart, pointIndex) {
        const meta = chart.getDatasetMeta(0);
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
        // context.fillStyle = "#ff0000";
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

approval_fxn('06-15-2020');