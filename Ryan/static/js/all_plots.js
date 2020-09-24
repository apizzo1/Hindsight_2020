
var curr_date = ""
var curr_state = ""
var this_day = []

// add states to dropdown selector
d3.json("http://127.0.0.1:5000/api/v1.0/state_mobility").then(function (stateData) {

    var states = []
    stateData.forEach(day => {
        if (day.month == "2") {
            var state = day.state
            states.push(state)
        }
    })
    var states_list = states.slice(0, 51)
    d3.select('#selDataset').selectAll('option').data(states_list).enter().append('option').text(function (data) {
        return data;
    });
});

// add dates to dropdown selector
d3.json("http://127.0.0.1:5000/api/v1.0/state_mobility").then(function (datesData) {

    var dates = []
    datesData.forEach(day => {
        if (day.state === "Alabama") {
            var date = day.month + "-" + day.day + "-" + day.year
            dates.push(date)
        }
    })
    d3.select('#selDay').selectAll('option').data(dates).enter().append('option').text(function (data) {
        return data;
    });
});

// set day based change charts
function dayChanged(value) {
    var myDate= new Date(value)
    var e_date=myDate.getTime()
    d3.json("http://127.0.0.1:5000/api/v1.0/headlines").then(function(data){

        d3.selectAll('h1').remove();
        d3.selectAll('img').remove();

        data.forEach(day => {
            day.date=new Date(day.date)
        })
        data.forEach(day => {
            day.date= day.date.getTime()
        })
        data.forEach(day => {
            if (day.date===e_date){
                day_head=day
            }
        })
        d3.select('#headline').append('h1').text(day_head.headline)
        d3.select('#art_image').append('img').attr("src",day_head.img_url)
        
    })


// creates national charts
    d3.json('http://127.0.0.1:5000/api/v1.0/national_mobility').then(function (nationalData) {
        var datasets = [];
        nationalData.forEach(val => {
            var retail = val.retail;
            var grocery = val.grocery;
            var parks = val.parks;
            var transit = val.transit;
            var office = val.work;
            var date = val.month + "-" + val.day + "-" + val.year
            var day_dict = {
                date: date,
                retail: retail,
                grocery: grocery,
                parks: parks,
                transit: transit,
                office: office
            };
            datasets.push(day_dict);
        });

        datasets.forEach(day => {
            if (day.date === value) {
                day_data = day;
            }
        })

        var trace1 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Retail",
            r: [-2, datasets[0].retail, datasets[0].retail, -2],
            theta: [0, 0, 72, 0],
            fill: "toself",
            fillcolor: '#E4FF87',
            line: {
                color: 'black'
            }
        }
        var daytrace1 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Retail",
            r: [-2, day_data.retail, day_data.retail, -2],
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
            r: [-2, datasets[0].parks, datasets[0].parks, -2],
            theta: [0, 72, 144, 0],
            fill: "toself",
            fillcolor: 'red',
            line: {
                color: 'black'
            }
        }
        var daytrace2 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Parks",
            r: [-2, day_data.parks, day_data.parks, -2],
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
            r: [-2, datasets[0].grocery, datasets[0].grocery, -2],
            theta: [0, 144, 216, 0],
            fill: "toself",
            fillcolor: 'blue',
            line: {
                color: 'black'
            }
        }
        var daytrace3 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Grocery",
            r: [-2, day_data.grocery, day_data.grocery, -2],
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
            r: [-2, datasets[0].transit, datasets[0].transit, -2],
            theta: [0, 216, 288, 0],
            fill: "toself",
            fillcolor: 'orange',
            line: {
                color: 'black'
            }
        }
        var daytrace4 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Transit",
            r: [-2, day_data.transit, day_data.transit, -2],
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
            r: [-2, datasets[0].office, datasets[0].office, -2],
            theta: [0, 288, 360, 0],
            fill: "toself",
            fillcolor: 'purple',
            line: {
                color: 'black'
            }
        }
        var daytrace5 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Office",
            r: [-2, day_data.office, day_data.office, -2],
            theta: [0, 288, 360, 0],
            fill: "toself",
            fillcolor: 'purple',
            line: {
                color: 'black'
            }
        }
        var data = [trace1, trace2, trace3, trace4, trace5]
        var data2 = [daytrace1, daytrace2, daytrace3, daytrace4, daytrace5]

        var layout = {
            title: "Baseline 2020",
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
        var layout2 = {
            title: `${day_data.date}`,
            polar: {
                radialaxis: {
                    angle: 90,
                    tickangle: 90,
                    visible: true,
                    range: [-1, 1]
                }
            },
            showlegend: false
        }
        Plotly.newPlot('chart', data2, layout2);
        Plotly.newPlot('basechart', data, layout);

    })

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
}
function optionChanged(state) {
    curr_state = state
    var chart_data = []
    this_day.forEach(day => {
        if (day.state === curr_state) {
            chart_data = day
        }
    })
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


}