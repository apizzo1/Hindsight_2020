

d3.csv('../Resources/Google Mobility - National - Daily.csv').then(function (inputdata) {
    var datasets = [];
    var residential_data=[]
    inputdata.forEach(val => {
        var retail = val.gps_retail_and_recreation;
        var grocery = val.gps_grocery_and_pharmacy;
        var parks = val.gps_parks;
        var transit = val.gps_transit_stations;
        var office = val.gps_workplaces;
        var date =val.month + ", " + val.day + ", " + val.year
        var day_dict = {
            date:date,
            retail: retail,
            grocery: grocery,
            parks: parks,
            transit: transit,
            office: office
        };
        datasets.push(day_dict);
    });

    var chart_title=(Object.values(datasets[0])).slice(0,1)
    var chart_labels = (Object.keys(datasets[0])).slice(1,6);
    var chart_data = (Object.values(datasets[0])).slice(1,6);
    var this_day = (Object.values(datasets[180])).slice(1,6);

    var start_chart={
        values: chart_data,
        labels: chart_labels,
        type: 'pie',
        textposition: 'outside',
        domain:{column:0},
        hole: 0.6
    };
    console.log(chart_data)

    var selected_day={
        values: this_day,
        labels: chart_labels,
        domain:{column:1},
        type: 'pie',
        hole: 0.5
    };
    console.log(this_day)
    var data = [start_chart, selected_day];


    var layout = {
        title: "Change in Destination Volume",
        height: 400,
        width: 500,
        grid: {rows: 1, columns: 2},
        hovermode:false,
        legend: {
            'orientation':'h'
          }
    };

    Plotly.newPlot('chart', data, layout);
})
