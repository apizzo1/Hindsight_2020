// Initialize Variables
var serverUrl = '/api/v1.0/stocks'
var sliderDate = Math.floor(new Date('03-22-2020').getTime() / 1000.0)
var baseUrl = 'https://finnhub.io/api/v1/';
var category = 'stock/candle';
var startdate = new Date('January 1, 2020').getTime() / 1000.0;
var enddate = new Date('09-22-2020').getTime() / 1000.0;
var humanEndDate = new Date(enddate * 1000);
var sliderDate = d3.select('#slider-date').attr('current_time');
var humanSliderDate = new Date(sliderDate * 1000);
var stockLabels = ['Amazon', 'Netflix', '3M Co', 'Honeywell', 'MSA Safety Inc', 'Home Depot', 'Lowes', 'UBER', 'Boeing', 'Delta', 'Southwest'];
var stockValues = ['AMZN', 'NFLX', 'MMM', 'HON', 'MSA', 'HD', 'LOW', 'UBER', 'BA', 'DAL', 'LUV'];
var defaultTicker = 'DAL';
var chosenStocks = [defaultTicker, '...', '...'];
var symbols = [defaultTicker];
var stockTrace = [];
var maxData = 0;
var queries = [];
var promises = [];

// Builds a single trace based on the passed values of dates, data, and stock ticker
function buildTrace(dates, data, symbol) {
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

// Function called from the index.html from the OnChange attribute
function selectStock(id, value) {
  // Initialize the array to hold the queries
    promises = [];

  // Get the last character of the id
  var position = id.slice(-1) - 1;

  // Looks at how many tickers are already being displayed then adds, replaces, or removes (to the queries array) 
  // the chosen ticker from the dropdown
  switch (symbols.length) {
    case 0:
      if (value === '...') {
        symbols.splice(0, 0, defaultTicker);
        queries.splice(0, 0, `${baseUrl}${category}?symbol=${defaultTicker}&resolution=D&from=${startdate}&to=${enddate}&token=`);
        // console.log('case position = 0');
      }
      else {
        symbols.splice(0, 0, value);
        queries.splice(0, 0, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=`);
        // console.log('case position = 1');
      }
      chosenStocks[position] = value;
      break;
    case 1:
      if (value === '...') {
        // console.log("position=",position)
        if (position === 0) {
          symbols.splice(0, 1, defaultTicker);
          queries.splice(0, 1, `${baseUrl}${category}?symbol=${defaultTicker}&resolution=D&from=${startdate}&to=${enddate}&token=`);
        }
        // console.log('case position = 2');
      }
      else if (chosenStocks[position] === '...') {
        symbols.push(value);
        queries.push(`${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=`);
        // console.log('case position = 3');
      }
      else {
        symbols.splice(0, 1, value);
        queries.splice(0, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=`);
        // console.log('case position = 4');
      }
      chosenStocks[position] = value;
      break;
    case 2:
      if (value === '...') {
        if (chosenStocks[position] === symbols[0]) {
          symbols.shift();
          queries.shift();
          // console.log('case position = 5');
        }
        else if (chosenStocks[position] === symbols[1]) {
          symbols.pop();
          queries.pop();
          // console.log('case position = 6');
        }
      }
      else {
        if (chosenStocks[position] === '...') {
          symbols.push(value);
          queries.push(`${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=`);
          // console.log('case position = 7');
        }
        else if (chosenStocks[position] === symbols[0]) {
          symbols.splice(0, 1, value);
          queries.splice(0, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=`);
          // console.log('case position = 8');
        }
        else if (chosenStocks[position] === symbols[1]) {
          symbols.splice(1, 1, value);
          queries.splice(1, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=`);
          // console.log('case position = 9');
        }
      }
      chosenStocks[position] = value;
      break;
    case 3:
      if (value === '...') {
        if (chosenStocks[position] === symbols[0]) {
          symbols.shift();
          queries.shift();
          // console.log('case position = 10');
        }
        else if (chosenStocks[position] === symbols[1]) {
          symbols.splice(1, 1);
          queries.splice(1, 1);
          // console.log('case position = 11');
        }
        else if (chosenStocks[position] === symbols[2]) {
          symbols.pop();
          queries.pop();
          // console.log('case position = 12');
        }
      }
      else {
        if (chosenStocks[position] === symbols[0]) {
          symbols.splice(0, 1, value);
          queries.splice(0, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=`);
          // console.log('case position = 13');
        }
        else if (chosenStocks[position] === symbols[1]) {
          symbols.splice(1, 1, value);
          queries.splice(1, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=`);
          // console.log('case position = 14');
        }
        else if (chosenStocks[position] === symbols[2]) {
          symbols.splice(2, 1, value);
          queries.splice(2, 1, `${baseUrl}${category}?symbol=${value}&resolution=D&from=${startdate}&to=${enddate}&token=`);
          // console.log('case position = 15');
        }
      }
      chosenStocks[position] = value;
      break;
    default:
      console.log('the array is the wrong the length')
  }

  // generate a promise for each of the queries in the array
  queries.forEach(function (query) {
    if (!(query === '...')) {
      promises.push(d3.json(serverUrl + '?url=' + encodeURIComponent(query)));
//       promises.push(d3.json(serverUrl + '?url=' + query));
    }
  });

  // Once all the promises are fulfilled, then start using the data
  // values is an array of length number of data sets, each index holds an array with the data itself
  Promise.all(promises).then((values) => {

    var maxes = [];

    // find the max value for each data set
    for (i = 0; i < values.length; i++) {
      maxes.push(Math.max(...values[i].c));
    }
    
    // find the highest max of the data sets
    maxData = Math.max(...maxes);
    if (Math.max(values.c) > maxData) {
      maxData = values.c;
    }

    // Build the array that will hold the dates which will act as the x-axis for the chart
    if (values.length > 0) {
      var convDates = [];
      for (var i = 0; i < values[0].t.length; i++) {
        convDates.push(new Date(values[0].t[i] * 1000));
      }

      stockTrace = []
      var data = []
      
      // build a trace for each data set and add that data set to the data array that will be used in the Ployly chart
      values.forEach(function (value, index) {
        stockTrace[index] = buildTrace(convDates, value, symbols[index]);
        data.push(stockTrace[index]);
      })

      // create a trace for a vertical line indicating the data chosen by the user with the date slider
      vertTrace = {
        'x': [sliderDate, sliderDate],
        'y': [0, maxData],
        name: 'Selected Date',
        type: 'scatter',
        'mode': 'lines',
        'line': { 'color': 'grey', dash: 'dash' },
        'showlegend': false,
      }
      data.push(vertTrace);

      // set the layout values for the chart
      var layout = {
        dragmode: 'zoom',
        font: {
          size: 12,
        },
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

      // create the chart
      Plotly.newPlot('stockChart', data, layout);
    }
  });
}

// Listen for a change on the date slider
dateSlider.noUiSlider.on('change', function (values, handle) {
  sliderDate = (values[handle]);
  selectStock('stock1', chosenStocks[0]);
  selectStock('stock2', chosenStocks[1]);
  selectStock('stock3', chosenStocks[2]);
});

// Initialize the chart with a default value
selectStock('stock1', symbols[0]);

// Build a drop down list for each of the three dropdown
// The buildDropdown function resides in unemployment.js
buildDropdown("#stock1", stockLabels, stockValues);
buildDropdown("#stock2", stockLabels, stockValues);
buildDropdown("#stock3", stockLabels, stockValues);
