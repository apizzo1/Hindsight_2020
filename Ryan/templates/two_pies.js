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
        var day_dict = {
            retail: retail,
            grocery: grocery,
            parks: parks,
            transit: transit,
            office: office
        };
        datasets.push(day_dict);
    });

    var color = ['red', 'green', 'blue', 'yellow', 'orange', 'brown', 'purple']
    var labels = Object.keys(datasets[0]);
    var values = Object.values(datasets[0]);
    var day_change = Object.values(datasets[150]);

    var options = {
        title: {
            display: true,
            text: 'Custom Chart Title'
        }
    }

    var data = {
        labels: labels,
        datasets: [{
            label: 'What Are You Doing?',
            backgroundColor: color,
            borderColor: color,
            data: values
        }]
    }

    var data2 = {
        labels: labels,
        datasets: [{
            label: 'What Are You Doing?',
            backgroundColor: color,
            borderColor: color,
            data: day_change
        }]
    }
    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        opitons: options
    });
    var myDoughnutChart2 = new Chart(dtx, {
        type: 'polarArea',
        data: data2,
        opitons: options
    });


});