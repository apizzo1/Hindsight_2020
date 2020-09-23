// Polygon_API_Key = "KXQPHVRu6ZsaxBwaKuKQQPy_O8zQQSGn"
// baseURL = 'https://api.polygon.io/v1/open-close/'
// ticker = 'AMZN'
// date = '2020-09-21'

// queryURL = `${baseURL}${ticker}/${date}?apiKey=${Polygon_API_Key}`

// d3.json(queryURL).then(function(stockData) {
//     console.log(stockData);
// });

const request = require('request');

request('https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=1&from=1572651390&to=1572910590&token=', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
});