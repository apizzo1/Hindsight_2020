var sliderDate = Math.floor(new Date('03-22-2020').getTime() / 1000.0)
var baseUrl = 'https://finnhub.io/api/v1/';
var category = 'stock/candle';
var symbol = 'AMZN';
var startdate = new Date('January 1, 2020').getTime() / 1000.0;
// startdate = '1572651390'
var enddate = new Date('09-22-2020').getTime() / 1000.0;
var humanEndDate = new Date(enddate * 1000);
var humanSliderDate = new Date(sliderDate * 1000);
// enddate = '1572910590'
finnhub_API_Key = "btla6h748v6omckuq520"

var stockLabels = ['Amazon', 'Netflix', '3M Co', 'Honeywell', 'MSA Safety Inc', 'Home Depot', 'Lowes', 'UBER', 'Century21', 'Boeing'];
var stockValues = ['AMZN', 'NFLX', 'MMM', 'HON', 'MSA'];
var defaultTicker = 'MSA';
var chosenStocks = [defaultTicker, '...', '...'];
console.log(`1st: ${chosenStocks}`);
var symbols = [defaultTicker];
var stockTrace = [];

var queries = [];
var promises = [];
// var queue = d3.queue();

function buildTrace(dates, data, symbol) {
  // console.log(`data.c = ${data.c}`);
  var trace = {
    x: dates,
    y: data.c,
    name: symbol,
    type: 'scatter',
    xaxis: 'x',
    yaxis: 'y',
  };
  return trace;
}

function selectStock(id, value) {
  console.log(`In Function: ${chosenStocks}`);
  promises = [];
  console.log(value);
  // Get the last character of the id
  var position = id.slice(-1) - 1;
  console.log(`value = ${value}`);
  switch (symbols.length) {
    case 0:
      if (value === '...') {
        symbols.splice(0, 0, defaultTicker);
        queries.splice(0, 0, `${baseUrl}${category}?symbol=${defaultTicker}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
        console.log('case position = 0');
      }
      else {
        symbols.splice(0, 0, value);
        queries.splice(0, 0, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
        console.log('case position = 1');
      }
      chosenStocks[position] = value;
      break;
    case 1:
      console.log(`value in case 1: ${value}`);
      if (value === '...') {
        symbols.splice(0, 1, defaultTicker);
        queries.splice(0, 1, `${baseUrl}${category}?symbol=${defaultTicker}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
        console.log('case position = 2');
        console.log(`In CP2: ${chosenStocks}`);
      }
      else if (chosenStocks[position] === '...') {
        symbols.push(value);
        queries.push(`${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
        console.log('case position = 3');
      }
      else {
        symbols.splice(0, 1, value);
        queries.splice(0, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
        console.log('case position = 4');
      }
      chosenStocks[position] = value;
      console.log(`End CP2: ${chosenStocks}`);
      break;
    case 2:
      if (value === '...') {
        if (chosenStocks[position] === symbols[0]) {
          symbols.shift();
          queries.shift();
          console.log('case position = 5');
        }
        else if (chosenStocks[position] === symbols[1]) {
          symbols.pop();
          queries.pop();
          console.log('case position = 6');
        }
      }
      else {
        if (chosenStocks[position] === '...') {
          symbols.push(value);
          queries.push(`${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
          console.log('case position = 7');
        }
        else if (chosenStocks[position] === symbols[0]) {
          symbols.splice(0, 1, value);
          queries.splice(0, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
          console.log('case position = 8');
        }
        else if (chosenStocks[position] === symbols[1]) {
          symbols.splice(1, 1, value);
          queries.splice(1, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
          console.log('case position = 9');
        }
      }
      chosenStocks[position] = value;
      break;
    case 3:
      if (value === '...') {
        if (chosenStocks[position] === symbols[0]) {
          symbols.shift();
          queries.shift();
          console.log('case position = 10');
        }
        else if (chosenStocks[position] === symbols[1]) {
          symbols.splice(1, 1);
          queries.splice(1, 1);
          console.log('case position = 11');
        }
        else if (chosenStocks[position] === symbols[2]) {
          symbols.pop();
          queries.pop();
          console.log('case position = 12');
        }
      }
      else {
        if (chosenStocks[position] === symbols[0]) {
          symbols.splice(0, 1, value);
          queries.splice(0, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
          console.log('case position = 13');
        }
        else if (chosenStocks[position] === symbols[1]) {
          symbols.splice(1, 1, value);
          queries.splice(1, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
          console.log('case position = 14');
        }
        else if (chosenStocks[position] === symbols[2]) {
          symbols.splice(2, 1, value);
          queries.splice(2, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=${finnhub_API_Key}`);
          console.log('case position = 15');
        }
      }
      chosenStocks[position] = value;
      break;
    default:
      console.log('the array is the wrong the length')
  }
  console.log(chosenStocks)

  console.log(symbols);
  queries.forEach(function (query) {
    if (!(query === '...')) {
      promises.push(d3.json(query));
    }
  });

  Promise.all(promises).then((values) => {
    // console.log(values);

    if (values.length > 0) {
      var convDates = [];
      for (var i = 0; i < values[0].t.length; i++) {
        convDates.push(new Date(values[0].t[i] * 1000));
      }
      stockTrace = []
      var data = []
      values.forEach(function (value, index) {
        // console.log(`index = ${index}, symbol = ${symbols[index]}, value = ${value}`);
        stockTrace[index] = buildTrace(convDates, value, symbols[index]);
        data.push(stockTrace[index]);
      })
      // var stockTrace1 = buildTrace(convDates, stock1Data, symbols[0]);
      // var data = [stockTrace1];

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
          rangeslider: { range: ['01-01-2020', humanSliderDate] },
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
    }
  });
}

selectStock('stock1', symbols[0]);
buildDropdown("#stock1", stockLabels, stockValues);
buildDropdown("#stock2", stockLabels, stockValues);
buildDropdown("#stock3", stockLabels, stockValues);