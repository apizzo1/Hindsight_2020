// Function called from index.html  to build the unemployment chart
function buildLinePlot(selection, userDate) {
    // Initialize variables
    selectDates = [];
    selectMain = [];
    selectSelect = [];
    priorDates = [];
    priorMain = [];
    priorSelect = [];
    postDates = [];
    postMain = [];
    postSelect = [];

    // Flask Wrapper API call to gather the data
    d3.json('http://127.0.0.1:5000/api/v1.0/ui_rate').then(function (unempData) {
        startDate = Date.parse(new Date('2005-01-01'));
        endDate = Date.parse(unempData[871]['DATE']);

        // split the data into three sections
        for (i = 0; i < unempData.length; i++) {
            currDate = Date.parse(unempData[i]['DATE']);
            // section 1: data from start day to end of 2019
            if (currDate < new Date('2020-01-01')) {
                priorDates.push(currDate);
                priorMain.push(unempData[i]['UNRATE']);
                priorSelect.push(unempData[i][selection]);
            }
            // section 2: data from beginning of 2020 to the date selected on the slider
            else if (currDate < userDate) {
                selectDates.push(currDate);
                selectMain.push(unempData[i]['UNRATE']);
                selectSelect.push(unempData[i][selection]);
            }
            // section 3: data from the date selected on the slider to the end of the year
            else {
                postDates.push(currDate);
                postMain.push(unempData[i]['UNRATE']);
                postSelect.push(unempData[i][selection]);
            }
        }

        // National Data: build trace for data in section 1
        var priorTrace = {
            type: 'line',
            x: priorDates,
            y: priorMain,
            showlegend: false,
        };

        // National Data: build trace for data in section 2, this will be a highlighted section
        var mainTrace = {
            type: 'line',
            name: 'National Unemployment',
            x: selectDates,
            y: selectMain,
        };

        // National Data: build trace for data in section 3
        var postTrace = {
            type: 'line',
            x: postDates,
            y: postMain,
            showlegend: false,
        }

        // check if the user removed the drop down selection, if not, run this code
        if (!(selection == '...')) {

            // Demographic Data: build trace for data in section 1
            var priorSelTrace = {
                type: 'line',
                x: priorDates,
                y: priorSelect,
                showlegend: false,
            };

            // Demographic Data: build trace for data in section 2, this will be the highlight section
            var mainSelTrace = {
                type: 'line',
                name: `National Unemployment - ${selection}`,
                x: selectDates,
                y: selectSelect,
            };

            // Demographic Data: build trace for data in section 3
            var postSelTrace = {
                type: 'line',
                x: postDates,
                y: postSelect,
                showlegend: false,
            }
            // display National and Demographic traces
            var data = [priorTrace, mainTrace, postTrace, priorSelTrace, mainSelTrace, postSelTrace];
        }
        else {
            // display only the National traces
            var data = [priorTrace, mainTrace, postTrace];
        }

        // Set up the layout for the chart
        var layout = {
            title: 'Unemployment Data',
            margin:{
                // t:60,
                b:20,
                r:30,
                l:40
            },
            // set colors for the traces (this allows for highlighting the data in section 2)
            colorway: ['99CCFF', '#0000FF', '99CCFF', '#FFCC00', '#FF9900', '#FFCC00'],
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

        // create chart
        Plotly.newPlot('unemployment', data, layout);
    });
}

// Build Dropdown function
// Parameters:
//      id = the id in the index.html where the dropdown will reside on the page
//      labels = an array that holds the strings that will display in the dropdown
//      values = an array that holds the strings that will be the value attribute for the html option tag
function buildDropdown(id, labels, values) {
    var req_option = d3.select(id);
    req_option.append("option").attr("value", "...").text("Select Option");
    for (var j = 0; j < values.length; j++) {
        req_option.append("option").attr("value", values[j]).text(labels[j]);
    }
};

// selectOption Function
// Parameter: chosen = the value of the option tag od the chosen drop down option
function selectOption(chosen) {
    gblChosen=chosen;
    buildLinePlot(chosen, sliderDate);
}

// Strings that will be displayed in the drop down
var labels = ['Age 16-19', 'Age over 20',
    'Race: African American', 'Race: Hispanic/Latino', 'Race: White',
    'Gender: Male', 'Gender: Female',
    'Education: No HS graduation', 'Education: HS, no college', 'Education: Bachelors Degree', 'Education: Masters Degree', 'Education: Doctoral Degree'];

// strings that will be the value attribute on the option tag in the html when the drop down is built
var values = ['16-19', 'over20',
    'AfricanAmer', 'Latinx', 'White',
    'Men', 'Women',
    'no-HS-grad', 'HS-no-college', 'Bachelors', 'Masters', 'Doctoral'];

// create global variables to hold the slider date the drop down selection
var sliderDate;
var gblChosen='...';

// Call the build drop down function passing the labels and values as well as the index.html id tag
buildDropdown("#compare", labels, values);

// Listener for hearing a change in the date slider
dateSlider.noUiSlider.on('change', function (values, handle) {
    // grab the date
    sliderDate = (values[handle]);
    // call the build chart function passing in the slider date and drop down selection
    buildLinePlot(gblChosen, sliderDate);
});

// Call the build chart function to initialize the chart on the page
buildLinePlot('...', sliderDate);
