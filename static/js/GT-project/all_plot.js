// set up date listener for plot interaction
dateSlider.noUiSlider.on('change', function (values, handle) {
    datebuilder(values[handle]);
})
// call plot builder function with listener active

function datebuilder(value) {
    // convert slider output to formatted date
    var e_date = new Date(+value)
    var m = e_date.getUTCMonth() + 1
    var d = e_date.getUTCDate()
    var y = e_date.getUTCFullYear()
    var e_conv = (y + "/" + m + "/" + d)
    // build headline and image
    d3.json("/api/v1.0/headlines").then(function (data) {
        // convert dates within data for comparison
        data.forEach(day => {
            var full_date = new Date(day.date)
            var m = full_date.getUTCMonth() + 1
            var d = full_date.getUTCDate() - 1
            var y = full_date.getUTCFullYear()
            var e_conv = (y + "/" + m + "/" + d)
            day.date = e_conv
        })
        // compare data with selected date
        data.forEach(day => {
            if (day.date === e_conv) {
                day_head = day
            }
        })
        // push new article title and img
        d3.select('#NYT_headline').text(day_head.headline)
        d3.select('#background-NYT').attr("style", `background-image: url(${day_head.img_url})`)

    })
    // creates national charts
    d3.json('/api/v1.0/national_mobility').then(function (nationalData) {
        var datasets = [];
        nationalData.forEach(val => {
            var retail = val.retail;
            var grocery = val.grocery;
            var parks = val.parks;
            var transit = val.transit;
            var office = val.work;
            var date = val.year + "/" + val.month + "/" + val.day
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
        // filter dataset to selected day
        datasets.forEach(day => {
            if (day.date === e_conv) {
                day_data = day;
            }
        })
        // create traces with selected day
        try {
        var daytrace1 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Retail",
            r: [-1, day_data.retail, day_data.retail, -1],
            theta: [0, 5, 67, 0],
            fill: "toself",
            fillcolor: '#E4FF87',
            line: {
                color: 'black'
            }
        }
        var daytrace2 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Parks",
            r: [-1, day_data.parks, day_data.parks, -1],
            theta: [0, 77, 139, 0],
            fill: "toself",
            fillcolor: 'red',
            line: {
                color: 'black'
            }
        }
        var daytrace3 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Grocery",
            r: [-1, day_data.grocery, day_data.grocery, -1],
            theta: [0, 149, 211, 0],
            fill: "toself",
            fillcolor: 'blue',
            line: {
                color: 'black'
            }
        }
        var daytrace4 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Transit",
            r: [-1, day_data.transit, day_data.transit, -1],
            theta: [0, 221, 283, 0],
            fill: "toself",
            fillcolor: 'orange',
            line: {
                color: 'black'
            }
        }
        var daytrace5 = {
            type: "scatterpolar",
            mode: "lines",
            name: "Office",
            r: [-1, day_data.office, day_data.office, -1],
            theta: [0, 293, 355, 0],
            fill: "toself",
            fillcolor: 'purple',
            line: {
                color: 'black'
            }
        }
        var data2 = [daytrace1, daytrace2, daytrace3, daytrace4, daytrace5]

        var layout2 = {
            legend:{
                orientation:"h"
            },
            margin:{
                t:10,
                b:0,
                r:0,
                l:0
            },
            // title:"Seasonally-Adjusted Mobility",
            polar: {
                radialaxis: {
                    angle: 90,
                    tickangle: 90,
                    visible: true,
                    range: [-1, 1]
                },
                angularaxis:{
                    showticklabels:false
                }
            },
            showlegend: true
        }
        Plotly.newPlot('mobility_plot', data2, layout2);
    }
    catch(err){
        console.log('no_current_values')
    }
    })
}
