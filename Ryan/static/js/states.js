
var curr_date = ""
var curr_state = ""
var this_day = []

d3.json("http://127.0.0.1:5000/api/v1.0/state_mobility").then(function (inputdata) {

    var states = []
    inputdata.forEach(day => {
        if (day.month == "2") {
            var state = day.state
            states.push(state)
        }
    })
    var states_list = states.slice(0, 51)
    d3.select('#selDataset').selectAll('option').data(states_list).enter().append('option').text(function (data) {
        return data;
    });
})
d3.json("http://127.0.0.1:5000/api/v1.0/state_mobility").then(function (inputdata) {

    var dates = []
    inputdata.forEach(day => {
        if (day.state === "Alabama") {
            var date = day.month + "-" + day.day + "-" + day.year
            dates.push(date)
        }
    })
    d3.select('#selDay').selectAll('option').data(dates).enter().append('option').text(function (data) {
        return data;
    });
})
function dayChanged(value) {
    d3.json('http://127.0.0.1:5000/api/v1.0/state_mobility').then(function (inputdata) {
        curr_date = value
        var datasets = [];
        inputdata.forEach(val => {
            var retail = val.retail;
            var grocery = val.grocery;
            var parks = val.parks;
            var transit = val.transit;
            var office = val.work;
            var date = val.month + "-" + val.day + "-" + val.year
            var state_id = val.id
            var state = val.state
            var day_dict = {
                date: date,
                state_id: state_id,
                state: state,
                retail: retail,
                grocery: grocery,
                parks: parks,
                transit: transit,
                office: office
            };
            datasets.push(day_dict);
        });

        datasets.forEach(day => {
            if (day.date === curr_date) {
                this_day.push(day);
            }
        })
    })
};
function optionChanged(state, date) {
    d3.json('http://127.0.0.1:5000/api/v1.0/state_mobility').then(function (inputdata) {
        // format date
        var e_date = new Date(+date)
        var m = e_date.getUTCMonth() + 1
        var d = e_date.getUTCDate()
        var y = e_date.getUTCFullYear()
        var e_conv = (y + "/" + m + "/" + d)
        // parse data
        var datasets = [];
        inputdata.forEach(val => {
            var retail = val.retail;
            var grocery = val.grocery;
            var parks = val.parks;
            var transit = val.transit;
            var office = val.work;
            var date = val.month + "/" + val.day + "/" + val.year
            var state_id = val.id
            var state = val.state
            var day_dict = {
                date: date,
                state_id: state_id,
                state: state,
                retail: retail,
                grocery: grocery,
                parks: parks,
                transit: transit,
                office: office
            };
            datasets.push(day_dict);
            // filter by date
            datasets.forEach(day => {
                if (day.date === curr_date) {
                    this_day.push(day);
                }
            });
            // filter by state
            var chart_data;
            this_day.forEach(day => {
                if (day.state === state) {
                    chart_data = day
                }
            })

            // create traces
            var trace1 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Retail",
                r: [-2, chart_data.retail, chart_data.retail, -2],
                theta: [0, 0, 72, 0],
                fill: "toself",
                fillcolor: '#E4FF87',
                line: {
                    color: 'black'
                }
            }
            var trace2 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Parks",
                r: [-2, chart_data.parks, chart_data.parks, -2],
                theta: [0, 72, 144, 0],
                fill: "toself",
                fillcolor: 'red',
                line: {
                    color: 'black'
                }
            }
            var trace3 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Grocery",
                r: [-2, chart_data.grocery, chart_data.grocery, -2],
                theta: [0, 144, 216, 0],
                fill: "toself",
                fillcolor: 'blue',
                line: {
                    color: 'black'
                }
            }
            var trace4 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Transit",
                r: [-2, chart_data.transit, chart_data.transit, -2],
                theta: [0, 216, 288, 0],
                fill: "toself",
                fillcolor: 'orange',
                line: {
                    color: 'black'
                }
            }
            var trace5 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Office",
                r: [-2, chart_data.office, chart_data.office, -2],
                theta: [0, 288, 360, 0],
                fill: "toself",
                fillcolor: 'purple',
                line: {
                    color: 'black'
                }
            }
            var data = [trace1, trace2, trace3, trace4, trace5]
            var layout = {
                title: `${chart_data.state} Mobility on ${chart_data.date}`,
                polar: {
                    radialaxis: {
                        angle: 90,
                        tickangle: 90,
                        visible: true,
                        range: [-1, 1]
                    }
                },
                showlegend: true
            }
            Plotly.newPlot('statechart', data, layout);

        })
    })
}
    //     var chart_data = []
    //     this_day.forEach(day => {
    //         if (day.state === state) {
    //             chart_data = day
    //         }
    //     })
    //     console.log(chart_data)

    //     var trace1 = {
    //         type: "scatterpolar",
    //         mode: "lines",
    //         name: "Retail",
    //         r: [-2, chart_data.retail, chart_data.retail, -2],
    //         theta: [0, 0, 72, 0],
    //         fill: "toself",
    //         fillcolor: '#E4FF87',
    //         line: {
    //             color: 'black'
    //         }
    //     }
    //     var trace2 = {
    //         type: "scatterpolar",
    //         mode: "lines",
    //         name: "Parks",
    //         r: [-2, chart_data.parks, chart_data.parks, -2],
    //         theta: [0, 72, 144, 0],
    //         fill: "toself",
    //         fillcolor: 'red',
    //         line: {
    //             color: 'black'
    //         }
    //     }
    //     var trace3 = {
    //         type: "scatterpolar",
    //         mode: "lines",
    //         name: "Grocery",
    //         r: [-2, chart_data.grocery, chart_data.grocery, -2],
    //         theta: [0, 144, 216, 0],
    //         fill: "toself",
    //         fillcolor: 'blue',
    //         line: {
    //             color: 'black'
    //         }
    //     }
    //     var trace4 = {
    //         type: "scatterpolar",
    //         mode: "lines",
    //         name: "Transit",
    //         r: [-2, chart_data.transit, chart_data.transit, -2],
    //         theta: [0, 216, 288, 0],
    //         fill: "toself",
    //         fillcolor: 'orange',
    //         line: {
    //             color: 'black'
    //         }
    //     }
    //     var trace5 = {
    //         type: "scatterpolar",
    //         mode: "lines",
    //         name: "Office",
    //         r: [-2, chart_data.office, chart_data.office, -2],
    //         theta: [0, 288, 360, 0],
    //         fill: "toself",
    //         fillcolor: 'purple',
    //         line: {
    //             color: 'black'
    //         }
    //     }
    //     var data = [trace1, trace2, trace3, trace4, trace5]
    //     var layout = {
    //         title: `${chart_data.state} Mobility on ${chart_data.date}`,
    //         polar: {
    //             radialaxis: {
    //                 angle: 90,
    //                 tickangle: 90,
    //                 visible: true,
    //                 range: [-1, 1]
    //             }
    //         },
    //         showlegend: true
    //     }
    //     Plotly.newPlot('statechart', data, layout);


    // }
// console.log(this_day)
