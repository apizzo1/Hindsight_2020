d3.csv('../Resources/Google Mobility - National - Daily.csv').then(function (inputdata) {
  var datasets = [];
  var residential_data = []
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

  var chart_title = (Object.values(datasets[0])).slice(0, 1)
  var chart_labels = (Object.keys(datasets[0])).slice(1, 6);
  var chart_data = (Object.values(datasets[0])).slice(1, 6);
  var this_day = (Object.values(datasets[180])).slice(1, 6);

  var retail_data = []
  datasets.forEach(val => {
    retail_data.push(+val.retail)
  })
  var dates = []
  datasets.forEach(val => {
    dates.push(val.date)
  })
  var park_data = []
  datasets.forEach(val => {
    park_data.push(val.parks)
  })
  var transit = []
  datasets.forEach(val => {
    transit.push(val.transit)
  })
  var x = dates

  var trace1 = {
    type: "scatterpolar",
    mode: "lines",
    name: "Retail",
    r: [-2, datasets[0].retail, datasets[0].retail, -2],
    theta: [0, 0, 72, 0],
    fill: "toself",
    fillcolor: '#E4FF87',
    line: {
      color: 'black'
    }
  }
  var daytrace1 = {
    type: "scatterpolar",
    mode: "lines",
    name: "Retail",
    r: [-2, datasets[180].retail, datasets[180].retail, -2],
    theta: [0, 0, 72, 0],
    fill: "toself",
    fillcolor: '#E4FF87',
    line: {
      color: 'black'
    }
  }
  var trace2 = {
    type: "scatterpolar",
    mode: "lines",
    name:"Parks",
    r: [-2, datasets[0].parks, datasets[0].parks, -2],
    theta: [0, 72, 144, 0],
    fill: "toself",
    fillcolor: 'red',
    line: {
      color: 'black'
    }
  }
  var daytrace2 = {
    type: "scatterpolar",
    mode: "lines",
    name:"Parks",
    r: [-2, datasets[180].parks, datasets[180].parks, -2],
    theta: [0, 72, 144, 0],
    fill: "toself",
    fillcolor: 'red',
    line: {
      color: 'black'
    }
  }
  var trace3 = {
    type: "scatterpolar",
    mode: "lines",
    name:"Grocery",
    r: [-2, datasets[0].grocery, datasets[0].grocery, -2],
    theta: [0, 144, 216, 0],
    fill: "toself",
    fillcolor: 'blue',
    line: {
      color: 'black'
    }
  }
  var daytrace3 = {
    type: "scatterpolar",
    mode: "lines",
    name:"Grocery",
    r: [-2, datasets[180].grocery, datasets[180].grocery, -2],
    theta: [0, 144, 216, 0],
    fill: "toself",
    fillcolor: 'blue',
    line: {
      color: 'black'
    }
  }
  var trace4 = {
    type: "scatterpolar",
    mode: "lines",
    name:"Transit",
    r: [-2, datasets[0].transit, datasets[0].transit, -2],
    theta: [0, 216, 288, 0],
    fill: "toself",
    fillcolor: 'orange',
    line: {
      color: 'black'
    }
  }
  var daytrace4 = {
    type: "scatterpolar",
    mode: "lines",
    name:"Transit",
    r: [-2, datasets[180].transit, datasets[180].transit, -2],
    theta: [0, 216, 288, 0],
    fill: "toself",
    fillcolor: 'orange',
    line: {
      color: 'black'
    }
  }
  var trace5 = {
    type: "scatterpolar",
    mode: "lines",
    name:"Office",
    r: [-2, datasets[0].office, datasets[0].office, -2],
    theta: [0, 288, 360, 0],
    fill: "toself",
    fillcolor: 'purple',
    line: {
      color: 'black'
    }
  }
  var daytrace5 = {
    type: "scatterpolar",
    mode: "lines",
    name:"Office",
    r: [-2, datasets[180].office, datasets[180].office, -2],
    theta: [0, 288, 360, 0],
    fill: "toself",
    fillcolor: 'purple',
    line: {
      color: 'black'
    }
  }
  var data =[trace1, trace2, trace3, trace4, trace5]
  var data2 =[daytrace1, daytrace2, daytrace3, daytrace4, daytrace5]

  var layout = {
    title:"Baseline 2020",
    polar: {
      radialaxis: {
        angle:90,
        visible: true,
        range: [-1, 1]
      }
    },
    showlegend: true
  }
  var layout2 = {
    title:`${datasets[180].date}`,
    polar: {
      radialaxis: {
        angle:90,
        visible: true,
        range: [-1, 1]
      }
    },
    showlegend: false
  }
  console.log(datasets[180].retail, datasets[180].parks)
  Plotly.newPlot('chart', data2, layout2);
  Plotly.newPlot('basechart', data, layout);

})
