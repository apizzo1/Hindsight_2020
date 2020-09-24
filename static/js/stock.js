sliderDate = Math.floor(new Date('03-22-2020').getTime()/1000.0)
baseUrl = 'https://finnhub.io/api/v1/';
category = 'stock/candle';
symbol = 'AMZN';
startdate = new Date('January 1, 2020').getTime()/1000.0;
// startdate = '1572651390'
enddate = new Date('09-22-2020').getTime()/1000.0;
var humanEndDate = new Date( enddate *1000);
var humanSliderDate = new Date( sliderDate *1000);
console.log(humanEndDate, humanSliderDate)
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
    name: symbol,
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
    showlegend: true, 
    legend: {
      x: 0,
      y: 1
    },
    xaxis: {
      autorange: true, 
      domain: [0, 10], 
      range: ['01-01-2020', humanSliderDate], 
      rangeslider: {range: ['01-01-2020', humanSliderDate]}, 
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

stockLabels = ['Amazon'];
stockValues = ['AMZN'];
buildDropdown ("#stock1", stockLabels, stockValues);
buildDropdown ("#stock2", stockLabels, stockValues);
buildDropdown ("#stock3", stockLabels, stockValues);