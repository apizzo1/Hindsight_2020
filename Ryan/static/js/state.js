
var curr_date= ""
var curr_state=""
var this_day = []


var states = [];
for (var i = 0; i < 50; i++) {
    //Add the numbers to the array
    states.push(Math.floor(((Math.random() * 50) + 1)));
}
d3.select('#selDataset').selectAll('option').data(states).enter().append('option').text(function (data) {
    return data;
});

d3.json("http://127.0.0.1:5000/api/v1.0/state_mobility").then(function (inputdata) {

    var datasets = [];
    inputdata.forEach(val => {
        var retail = val.gps_retail_and_recreation;
        var grocery = val.gps_grocery_and_pharmacy;
        var parks = val.gps_parks;
        var transit = val.gps_transit_stations;
        var office = val.gps_workplaces;
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

    var dates = datasets.map(day => day.date);
    d3.select('#selDay').selectAll('option').data(dates).enter().append('option').text(function (data) {
        return data;
    });
})

function dayChanged(value) {
    d3.json('http://127.0.0.1:5000/api/v1.0/state_mobility').then(function (inputdata) {
        curr_date=value
        var datasets = [];
        inputdata.forEach(val => {
            var retail = val.gps_retail_and_recreation;
            var grocery = val.gps_grocery_and_pharmacy;
            var parks = val.gps_parks;
            var transit = val.gps_transit_stations;
            var office = val.gps_workplaces;
            var date = val.month + "-" + val.day + "-" + val.year
            var state = val.statefips
            var day_dict = {
                date: date,
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
    // console.log(this_day)

};
function optionChanged(state){
    console.log(this_day)
}
// console.log(this_day)
