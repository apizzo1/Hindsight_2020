

function buildLinePlot(selection) {
    dates = [];
    unempMain = [];
    unempSelect = [];
    
    d3.csv('data/Unemployment/UNRATE.csv').then(function(unempData) {
        // console.log(unempData);
        startDate = unempData[0]['DATE'];
        endDate = unempData[871]['DATE'];
        // console.log(startDate, endDate);
        for (i=0; i< unempData.length; i++) {
            dates.push(unempData[i]['DATE']);
            unempMain.push(unempData[i]['UNRATE']);
            unempSelect.push(unempData[i][selection])
        }
        // console.log(dates);
        // console.log(unempMain);

        var mainTrace = {
            type: 'line',
            name: 'National Unemployment',
            x: dates,
            y: unempMain,
        };

        var selectTrace = {
            type: 'line',
            name: `Unemployment for ${selection}`,
            x: dates,
            y: unempSelect,
        };

        var data = [mainTrace, selectTrace];

        var layout = {
            title: 'Unemployment Data',
            showlegend: true,
            legend: {
                x: 0,
                // xanchor: 'right',
                y: 1
            },
            xaxis: {
                range: [startDate, endDate],
                // type: "date",
            },
            yaxis: {
                title: {
                    text: 'Percent(%) Unemployment'
                },
                autorange: true,
                type: 'linear'
            },
        };

        Plotly.newPlot('unemployment', data, layout);
    });
}

buildLinePlot('16-19');