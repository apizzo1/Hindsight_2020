d3.json('http://127.0.0.1:5000/api/v1.0/headlines').then(function(data){
    dates=data.map(day => day.date)
    d3.select('#selDataset').selectAll('option').data(dates).enter().append('option').text(function (data) {
        return data;
    });
})

function optionChanged(value){
    d3.json("http://127.0.0.1:5000/api/v1.0/headlines").then(function(data){
        d3.selectAll('h1').remove();
        d3.selectAll('img').remove();
        data.forEach(day => {
            if (day.date===value){
                day_head=day
            }
        })
        d3.select('#headline').append('h1').text(day_head.headline)
        d3.select('#art_image').append('img').attr("src",day_head.img_url)
        
    })
}