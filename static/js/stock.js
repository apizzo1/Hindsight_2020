sliderDate = Math.floor(new Date('09-22-2020').getTime()/1000.0)
baseUrl = 'https://finnhub.io/api/v1/';
category = 'stock/candle';
symbol = 'AMZN';
startdate = new Date('December 31, 2019').getTime()/1000.0;
// startdate = '1572651390'
enddate = sliderDate;
var humanEndDate = new Date( sliderDate *1000);
// enddate = '1572910590'
finnhub_API_Key = "btla6h748v6omckuq520"

queryUrl = `${baseUrl}${category}?symbol=${symbol}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`;
console.log(queryUrl);

d3.json(queryUrl).then(function(stockData) {
  console.log(stockData);
  var convDates = [];
  for (var i=0; i<stockData.t.length; i++) {
    convDates.push(new Date( stockData.t[i] *1000));
  }
  var stockTrace = {
    x: convDates,
    y: stockData.c,
    // decreasing: {line: {color: '#7F7F7F'}}, 
    // high: stockData.h,
    // increasing: {line: {color: '#17BECF'}},
    // line: {color: 'rgba(31,119,180,1)'},
    // low: stockData.l,
    // open: stockData.o,
    type: 'scatter',
    xaxis: 'x',
    yaxis: 'y',
  };

  var data = [stockTrace];

  var layout = {
    dragmode: 'zoom', 
    margin: {
      r: 10, 
      t: 25, 
      b: 40, 
      l: 60
    }, 
    showlegend: false, 
    xaxis: {
      autorange: true, 
      domain: [0, 10], 
      range: ['12-31-2019', humanEndDate], 
      rangeslider: {range: ['12-31-2019', humanEndDate]}, 
      title: 'Date', 
      type: 'date'
    }, 
    yaxis: {
      autorange: true, 
      domain: [0, 1], 
      range: [100, 200], 
      type: 'linear'
    }
  };
  
  Plotly.newPlot('stockChart', data, layout);
});
