

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
            unempSelect.push(unempData[i][selection]);
        }
        // console.log(dates);
        // console.log(unempMain);

        var mainTrace = {
            type: 'line',
            name: 'National Unemployment',
            x: dates,
            y: unempMain,
        };

        if (!(selection == '...')) {
            var selectTrace = {
                type: 'line',
                name: `Unemployment for ${selection}`,
                x: dates,
                y: unempSelect,
            };

            var data = [mainTrace, selectTrace];
        }
        else {
            var data = [mainTrace];
        }

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

function buildDropdown () {
    var labels = ['Age 16-19','Age over 20',
        'Race: African American','Race: Hispanic/Latino','Race: White',
        'Gender: Male','Gender: Female',
        'Education: No HS graduation','Education: HS, no college','Education: Bachelors Degree','Education: Masters Degree','Education: Doctoral Degree'];
    var values = ['16-19','over20',
        'AfricanAmer','Latinx','White',
        'Men','Women',
        'no-HS-grad','HS-no-college','Bachelors','Masters','Doctoral'];
    var req_option = d3.select("#compare");
    req_option.append("option").attr("value", "...").text("Select Comparison Option");
    for (var j=0; j<values.length; j++) {
        req_option.append("option").attr("value", values[j]).text(labels[j]);
    }
};

function selectOption (chosen) {
    // var selection = document.getElementById("compare").value;
    console.log(chosen);
    buildLinePlot(chosen);
}

buildDropdown();
buildLinePlot('...');
