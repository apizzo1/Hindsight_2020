var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);



d3.csv('Resources/Google Mobility - National - Daily.csv').then(function (inputdata) {
    // console.log(inputdata)
    var headlines=inputdata
    console.log(headlines[0])
    var out = headlines.map(day => day.gps_away_from_home);
    var grocery_pharmacy = headlines.map(day => day.gps_grocery_and_pharmacy);
    var parks = headlines.map(day => day.gps_parks);
    var residential = headlines.map(day => day.gps_residential);
    var retail = headlines.map(day => day.gps_retail_and_rec);
    var transit = headlines.map(day => day.gps_transit_stations);
    var work = headlines.map(day => day.gps_workplaces);
    var date=headlines.map(tag => tag.month +", " + tag.day +", "+ tag.year);
    console.log(typeof(date))


    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Director (Year)', 'Rotten Tomatoes', 'IMDB'],
            ['Alfred Hitchcock (1935)', 8.4, 7.9],
            ['Ralph Thomas (1959)', 6.9, 6.5],
            ['Don Sharp (1978)', 6.5, 6.4],
            ['James Hawes (2008)', 4.4, 6.2]
        ]);

        var options = {
            title: 'The Days of Our Lives',
            vAxis: { title: 'Activity Breakdown (%)' },
            isStacked: true
        };

        var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart'));

        chart.draw(data, options);
    }
});