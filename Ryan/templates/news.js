d3.csv('../Resources/headlines.csv').then(function(data){
    dates=data.map(day => day.date)
    d3.select('#selDataset').selectAll('option').data(dates).enter().append('option').text(function (data) {
        return data;
    });
})

function optionChanged(value){
    d3.csv("../Resources/headlines.csv").then(function(data){
        data.forEach(day => {
            if (day.date===value){
                day_data=day
            }
        })
        d3.select('#headline').selectAll('h1').data(day_data).enter().append('h1').text(function (data){
            return `<h1>${day_data.headline}</h1>`
        })
        
        console.log(day_data)
    })
}