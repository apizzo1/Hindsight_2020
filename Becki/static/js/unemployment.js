function buildLinePlot(selection, userDate) {
    selectDates = [];
    selectMain = [];
    selectSelect = [];
    priorDates = [];
    priorMain = [];
    priorSelect = [];
    postDates = [];
    postMain = [];
    postSelect = [];
    
    d3.csv('../data/Unemployment/UNRATE.csv').then(function(unempData) {
        // startDate = Date.parse(unempData[0]['DATE']);
        startDate = Date.parse(new Date('2005-01-01'));
        endDate = Date.parse(unempData[871]['DATE']);
        for (i=0; i< unempData.length; i++) {
            currDate = Date.parse(unempData[i]['DATE']);
            if (currDate < new Date('2020-01-01')) {
                priorDates.push(currDate);
                priorMain.push(unempData[i]['UNRATE']);
                priorSelect.push(unempData[i][selection]);
            }
            else if (currDate < userDate) {
                selectDates.push(currDate);
                selectMain.push(unempData[i]['UNRATE']);
                selectSelect.push(unempData[i][selection]);
            }
            else {
                postDates.push(currDate);
                postMain.push(unempData[i]['UNRATE']);
                postSelect.push(unempData[i][selection]);
            }
        }
        
        var priorTrace = {
            type: 'line',
            x: priorDates,
            y: priorMain,
            showlegend: false,
        };

        var mainTrace = {
            type: 'line',
            name: 'National Unemployment',
            x: selectDates,
            y: selectMain,
        };

        var postTrace = {
            type: 'line',
            x: postDates,
            y: postMain,
            showlegend: false,
        }

        if (!(selection == '...')) {

            var priorSelTrace = {
                type: 'line',
                x: priorDates,
                y: priorSelect,
                showlegend: false,
            };
    
            var mainSelTrace = {
                type: 'line',
                name: `National Unemployment - ${selection}`,
                x: selectDates,
                y: selectSelect,
            };
    
            var postSelTrace = {
                type: 'line',
                x: postDates,
                y: postSelect,
                showlegend: false,
            }

            var data = [priorTrace, mainTrace, postTrace, priorSelTrace, mainSelTrace, postSelTrace];
        }
        else {
            var data = [priorTrace, mainTrace, postTrace];
        }

        var layout = {
            title: 'Unemployment Data',
            colorway: ['99CCFF','#0000FF','99CCFF','#FFCC00','#FF9900','#FFCC00'],
            showlegend: true,
            legend: {
                x: 0,
                y: 1
            },
            xaxis: {
                range: [startDate, endDate],
                type: "date",
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

function buildDropdown (id, labels, values) {
    var req_option = d3.select(id);
    req_option.append("option").attr("value", "...").text("Select Comparison Option");
    for (var j=0; j<values.length; j++) {
        req_option.append("option").attr("value", values[j]).text(labels[j]);
    }
};

function selectOption (chosen) {
    buildLinePlot(chosen, sliderDate);
}

var labels = ['Age 16-19','Age over 20',
'Race: African American','Race: Hispanic/Latino','Race: White',
'Gender: Male','Gender: Female',
'Education: No HS graduation','Education: HS, no college','Education: Bachelors Degree','Education: Masters Degree','Education: Doctoral Degree'];
var values = ['16-19','over20',
'AfricanAmer','Latinx','White',
'Men','Women',
'no-HS-grad','HS-no-college','Bachelors','Masters','Doctoral'];

// need to add listener for date
var sliderDate = d3.select('#slider-date').attr('current_time');

// sliderDate = new Date('2020-08-01');
buildDropdown("#compare", labels, values);
buildLinePlot('...', sliderDate);
