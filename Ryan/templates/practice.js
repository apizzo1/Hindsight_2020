var ctx = document.getElementById('myChart').getContext('2d');

d3.csv('Resources/Google Mobility - National - Daily.csv').then(function (inputdata) {

    var labels=inputdata.map(tag => tag.month + ", " + tag.day + ", " + tag.year);
    var home=inputdata.map(day => +day.gps_residential)
    

    var data={
        labels:labels,
        datasets:{
            // label:"Variance",
            data:home
        }
    }
    console.log(data)
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data
        ,options: {
            scales:{
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date',
                        fontSize: 20
                    },
                    //type: 'linear',
                    position: 'bottom',
                    gridLines: {
                        display: false
                    }
                }],
                yAxes:[{
                    ticks:{
                        suggestedMin:-0.3,
                        suggestedMax:0.3
                    }
                }
                ]
            }
        }
    });

    // var dates = inputdata.map(tag => tag.month + ", " + tag.day + ", " + tag.year);
    // console.log(inputdata[0])

    // var data = inputdata.map(day => day.gps_residential)
    // console.log(data)


    // var points = []
    // inputdata.forEach(day => {
    //     var date = day.month + ", " + day.day + ", " + day.year
    //     var home = +day.gps_residential
    //     var point = {
    //         x: new Date(date),
    //         y: home
    //     }
    //     points.push(point)
    // })
    // console.log(points)

    // // // console.log(data);


    // var myLineChart = new Chart(ctx, {
    //     type: 'line',
    //     data: data
    //     // options: options
    // });



    // var keys = Object.keys(inputdata[0]);
    // console.log(keys)
    // var labels = keys.slice(3, 10);
    // var values = Object.values(inputdata[0]);
    // var newValues = values.slice(3, 10);
    // console.log(newValues)
    // console.log(typeof (values))
    // var color = ['red', 'green', 'blue', 'yellow', 'orange', 'brown', 'purple']


    // var data = {
    //     labels: labels,
    //     datasets: [{
    //         label: 'What Are You Doing?',
    //         backgroundColor: color,
    //         borderColor: color,
    //         data: newValues
    //     }]
    // }
    // var options= {
    //     tooltips: {enabled: false},
    //     hover: {mode: null},
    //   }

    // var myDoughnutChart = new Chart(ctx, {
    //     type: 'doughnut',
    //     data: data,
    //     opitons: options
    // });



});

