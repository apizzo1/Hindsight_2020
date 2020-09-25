
dateSlider.noUiSlider.on('change', function (values, handle) {
    datebuilder(values[handle]);
})

function datebuilder(value) {
    // convert slider output to formatted date
    var e_date = new Date(+value)
    var m = e_date.getUTCMonth() + 1
    var d = e_date.getUTCDate()
    var y = e_date.getUTCFullYear()
    var e_conv = (y + "/" + m + "/" + d)
    // build headline and image
    d3.json("http://127.0.0.1:5000/api/v1.0/headlines").then(function (data) {
        // clear existing values from html
        d3.select('h5').remove();
        d3.selectAll('img').remove();
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
        d3.select('#NYT_headline').append('h5').text(day_head.headline)
        d3.select('.page-header').append('img').attr("src", day_head.img_url)

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
        datasets.forEach(day => {
            if (day.date === e_conv) {
                day_data = day;
            }
        })
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
        var data2 = [daytrace1, daytrace2, daytrace3, daytrace4, daytrace5]

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
            showlegend: true
        }
        Plotly.newPlot('mobility_plot', data2, layout2);
    })
}