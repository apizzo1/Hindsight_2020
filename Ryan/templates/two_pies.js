var ctx = document.getElementById('myChart').getContext('2d');
var dtx = document.getElementById('myChart2').getContext('2d');



d3.csv('../Resources/Google Mobility - National - Daily.csv').then(function (inputdata) {

    var datasets = [];
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

    var color = ['red', 'green', 'blue', 'yellow', 'orange']
    var chart_labels = (Object.keys(datasets[0])).slice(1,6);
    var chart_data = (Object.values(datasets[0])).slice(1,6);
    var this_day = (Object.values(datasets[180])).slice(1,6);

    var options = {
        legend: {
            display:false
        },
        title: {
            display: true,
            text: 'Custom Chart Title'
        }
    }

    var data = {
        labels: chart_labels,
        datasets: [{
            label: 'What Are You Doing?',
            backgroundColor: color,
            borderColor: color,
            data: chart_data
        }]
    }

    var data2 = {
        labels: chart_labels,
        datasets: [{
            label: 'What Are You Doing?',
            backgroundColor: color,
            borderColor: color,
            data: this_day
        }]
    }
    var myDoughnutChart = new Chart(ctx, {
        type: 'polarArea',
        data: data,
        template: options
    });
    var myDoughnutChart2 = new Chart(dtx, {
        type: 'polarArea',
        data: data2,
        template: options
    });


});