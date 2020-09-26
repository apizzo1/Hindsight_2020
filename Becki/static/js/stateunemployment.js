function stateUnemployment(state, date) {
    var humanSliderDate = new Date(+date);
    var month = humanSliderDate.getUTCMonth() + 1;
    
    d3.csv('../data/Unemployment/2020_Unemployment_by_state-percent-seasonally_adjusted.csv').then(stateData => {
        currStateData = [];
        for(i=0; i<stateData.length; i++) {
            if (stateData[i].State === state) {
                const keys = Object.keys(stateData[i]);
                keys.forEach((key, index) => {
                    console.log(`${key}: ${stateData[i][key]}`);
                    currStateData.push(stateData[i][key]);
                })
            }
        }
        currStateData.shift();

        stateTrace = {
            x: [1,2,3,4,5,6,7,8],
            y: currStateData,
            type: 'area',
            fill: 'tozeroy',
            fillcolor: 'rgba(255, 0, 0, 0.1)',
        }

        maxData = Math.max(...currStateData);
        
        vertTrace = {
            'x': [month, month],
            'y': [0, maxData],
            name: 'Selected Date',
            type: 'scatter',
            'mode': 'lines',
            'line': {'color': 'grey', dash: 'dash'},
            'showlegend': false,
        }

        plotData = [stateTrace, vertTrace];

        layout = {
            // title: state,
            xaxis: {
                tick0: '2019-12-01',
            },
            yaxis: {title: '%Unemployment'},
            showlegend: false,
        }

        Plotly.newPlot('stateUnemp', plotData, layout);
    });   
}

var sliderDate = d3.select('#slider-date').attr('current_time');
stateUnemployment('Kentucky', sliderDate);