// ***********************************************************************
// *                    State Data Card Functions                        *
// ***********************************************************************
// The three functions in this script build the following charts in the 
// state card on the dashboard
// stateUnemployment - displays the monthly unemployment data for the state
// single_state_fxn - displays the sparkline chart of COVID cases for the state
// optionChanged - displays the mobility graph for the state
//
// All three of these functions are called from the logic_slider_map.js
// whenever the slider date changes or a state is selected on the map
// ***********************************************************************

// draw state unemployment chart
function stateUnemployment(state, date) {
    // convert the passed date from the unix format to just the month value
    var month=moment.unix(date/1000).format("M");
    
    // Flask Wrapper API caller to get the state data
    d3.json('/api/v1.0/state_ui').then(stateData => {
        currStateData = [];

        // Put the data into the array in the correct order
        for (i = 0; i < stateData.length; i++) {
            if (stateData[i].State === state) {
                const keys = Object.keys(stateData[i]);
                keys.forEach((key, index) => {
                    currStateData.push(stateData[i][key]);
                })
            }
        }
        // Remove the state name from the beginning of the array
        currStateData.pop();

        // build the filled area trace for the state data
        stateTrace = {
            x: [1, 2, 3, 4, 5, 6, 7, 8],
            y: currStateData,
            name: 'UI',
            type: 'area',
            fill: 'tozeroy',
            fillcolor: 'rgba(255, 0, 0, 0.1)',
        }

        // find the maximum value in the data to allow for the vertical line to be the same height
        maxData = Math.max(...currStateData);

        // build the vertical line trace that will indicate the data selected from the date slider
        vertTrace = {
            'x': [month, month],
            'y': [0, maxData],
            name: 'Selected Date',
            type: 'scatter',
            hoverinfo: "none",
            'mode': 'lines',
            'line': { 'color': 'grey', dash: 'dash' },
            'showlegend': false,
        }

        // include both traces for display
        plotData = [stateTrace, vertTrace];

        // build the layout for the chart
        layout = {
            height: "100",
            margin: {
                t: "10",
                l: "20",
                r: "20",
                b: "20"
            },
            xaxis: {
                // set the values to display on the x-axis instead of the numbers
                ticktext: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
            },
            showlegend: false,
        }

        // create chart
        Plotly.newPlot('stateUnemp', plotData, layout);
    });
}

// draw state COVID case sparkline
function single_state_fxn(full_state, date) {
    
    // modified version of https://gist.github.com/calebgrove/c285a9510948b633aa47; returns abbreviation or full state name
    function abbrRegion(input, to) {
        var states = [
            ['Alabama', 'AL'],
            ['Alaska', 'AK'],
            ['American Samoa', 'AS'],
            ['Arizona', 'AZ'],
            ['Arkansas', 'AR'],
            ['Armed Forces Americas', 'AA'],
            ['Armed Forces Europe', 'AE'],
            ['Armed Forces Pacific', 'AP'],
            ['California', 'CA'],
            ['Colorado', 'CO'],
            ['Connecticut', 'CT'],
            ['Delaware', 'DE'],
            ['District Of Columbia', 'DC'],
            ['Florida', 'FL'],
            ['Georgia', 'GA'],
            ['Guam', 'GU'],
            ['Hawaii', 'HI'],
            ['Idaho', 'ID'],
            ['Illinois', 'IL'],
            ['Indiana', 'IN'],
            ['Iowa', 'IA'],
            ['Kansas', 'KS'],
            ['Kentucky', 'KY'],
            ['Louisiana', 'LA'],
            ['Maine', 'ME'],
            ['Marshall Islands', 'MH'],
            ['Maryland', 'MD'],
            ['Massachusetts', 'MA'],
            ['Michigan', 'MI'],
            ['Minnesota', 'MN'],
            ['Mississippi', 'MS'],
            ['Missouri', 'MO'],
            ['Montana', 'MT'],
            ['Nebraska', 'NE'],
            ['Nevada', 'NV'],
            ['New Hampshire', 'NH'],
            ['New Jersey', 'NJ'],
            ['New Mexico', 'NM'],
            ['New York', 'NY'],
            ['North Carolina', 'NC'],
            ['North Dakota', 'ND'],
            ['Northern Mariana Islands', 'NP'],
            ['Ohio', 'OH'],
            ['Oklahoma', 'OK'],
            ['Oregon', 'OR'],
            ['Pennsylvania', 'PA'],
            ['Puerto Rico', 'PR'],
            ['Rhode Island', 'RI'],
            ['South Carolina', 'SC'],
            ['South Dakota', 'SD'],
            ['Tennessee', 'TN'],
            ['Texas', 'TX'],
            ['US Virgin Islands', 'VI'],
            ['Utah', 'UT'],
            ['Vermont', 'VT'],
            ['Virginia', 'VA'],
            ['Washington', 'WA'],
            ['West Virginia', 'WV'],
            ['Wisconsin', 'WI'],
            ['Wyoming', 'WY'],
        ];
        
        var i; // Reusable loop variable
        if (to == 'abbr') {
            input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
            for (i = 0; i < states.length; i++) {
                if (states[i][0] == input) {
                    return (states[i][1]);
                }
            }
        } else if (to == 'name') {
            input = input.toUpperCase();
            for (i = 0; i < states.length; i++) {
                if (states[i][1] == input) {
                    return (states[i][0]);
                }
            }
        }
    }

    // fxn to find average of an array
    function find_avg (array) {
        var sum = 0;
        for (var x = 0; x < array.length; x++) {
            sum += array[x];
        }

        var avg = Math.round(sum / array.length);
        return avg;
    }

    // call abbrRegion fxn to abbreviate full state name
    var state = abbrRegion(full_state, 'abbr');

    // format date, end result should be yyyymmdd for API calls; set minimum date
    if (date < 1579651200000) {var moment_date = moment.unix(1579651200).add(1, 'days');}
    else {var moment_date = moment.unix(date / 1000);}

    // define url for state COVID API calls
    // var state_url = `https://api.covidtracking.com/v2/states/${state}/daily.json`;
    var state_path = '../static/Resources/state_covid_data.csv';

    // define blank arrays to push data into
    var case_array = [];
    var date_array = [];
    // var death_array = [];

    // begin API call; all "death" related/date-specific COVID data can be uncommented if desired
    // d3.json(state_url).then((response) => {
    d3.csv(state_path).then((response) => {
        for (var x = 0; x < response.length; x++) {

            // skip data past selected date
            if (moment(response[x].date, 'YYYY-MM-DD') > moment_date) {
                continue;
            }

            // skip data not pertaining to selected state
            if (response[x].state != state) {
                continue;
            }

            date_array.push(response[x].date);
            case_array.push(response[x].positive);
            // death_array.push(response[x]['death']);

            // isolate data for selected date if desired
            // if (response[x].date == api_date) {
            //     var select_cases = response[x].positive;
            //     var select_deaths = response[x].death;
            // }
        }

        // create arrays for daily increases in cases
        var case_increases = [];
        for (var x = (case_array.length - 2); x > -1; x--) {
            var increase = case_array[x] - case_array[x + 1];
            case_increases.push(increase);
        }

        // find 7-day moving avgs for a smoother sparkline
        var new_cases_avg = [];

        for (var x = 0; x < case_increases.length; x++) {
            var avg_array = [];
            if (x > (case_increases.length - 8)) {
                for (var y = x; y < (case_increases.length); y++) {
                    avg_array.push(case_increases[y]);
                }
            }
            else {
                for (var y = 0; y < 7; y++) {
                    avg_array.push(case_increases[x + y]);
                }
            }
            var avg = find_avg(avg_array);
            new_cases_avg.push(avg);
        }
        
        // if case data is available
        if (new_cases_avg.length != 0) {

            // clear any text if necessary
            d3.select('#state_covid_text').text("");

            // fxn to plot sparkline on HTML
            $(function() {
                $(`#state_cases`).sparkline(new_cases_avg, {
                    width: '200',
                    height: '60',
                    minSpotColor: false,
                    maxSpotColor: false,
                    highlightSpotColor: 'red',
                    highlightLineColor: 'red'
                });
            });
        }

        // if case data is empty
        else {
            
            // clear existing sparkline
            d3.select('#state_cases').selectAll('canvas').remove();

            // leave message
            d3.select('#state_covid_text').text("No data available for this date.");
        }
    });
}

// draw state mobility graph
function optionChanged(state, date) {
    d3.json('/api/v1.0/state_mobility').then(function(inputdata) {
        // format date
        var e_conv=moment.unix(date/1000).format("M/D/YYYY");
    
        // parse data
        var datasets = [];
        inputdata.forEach(val => {
            var retail = val.retail;
            var grocery = val.grocery;
            var parks = val.parks;
            var transit = val.transit;
            var office = val.work;
            var date = val.month + "/" + val.day + "/" + val.year
            var state_id = val.id
            var statename = val.state
            var day_dict = {
                date: date,
                state_id: state_id,
                state: statename,
                retail: retail,
                grocery: grocery,
                parks: parks,
                transit: transit,
                office: office
            };
            datasets.push(day_dict);
        });
        var this_day = [];
        // filter by date
        datasets.forEach(day => {
            if (day.date === e_conv) {
                this_day.push(day);
            }
        });
        // filter by state
        var chart_data;
        this_day.forEach(day => {
            if (day.state === state) {
                chart_data = day
            }
        })

        try {
            // create traces
            var trace1 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Retail",
                r: [-2, chart_data.retail, chart_data.retail, -2],
                theta: [0, 5, 67, 0],
                fill: "toself",
                fillcolor: '#E4FF87',
                line: {
                    color: 'black'
                }
            }
            var trace2 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Parks",
                r: [-2, chart_data.parks, chart_data.parks, -2],
                theta: [0, 77, 139, 0],
                fill: "toself",
                fillcolor: 'red',
                line: {
                    color: 'black'
                }
            }
            var trace3 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Grocery",
                r: [-2, chart_data.grocery, chart_data.grocery, -2],
                theta: [0, 149, 211, 0],
                fill: "toself",
                fillcolor: 'blue',
                line: {
                    color: 'black'
                }
            }
            var trace4 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Transit",
                r: [-2, chart_data.transit, chart_data.transit, -2],
                theta: [0, 221, 283, 0],
                fill: "toself",
                fillcolor: 'orange',
                line: {
                    color: 'black'
                }
            }
            var trace5 = {
                type: "scatterpolar",
                mode: "lines",
                name: "Office",
                r: [-2, chart_data.office, chart_data.office, -2],
                theta: [0, 293, 355, 0],
                fill: "toself",
                fillcolor: 'purple',
                line: {
                    color: 'black'
                }
            }
            var data = [trace1, trace2, trace3, trace4, trace5]
            var layout = {
                title: `${chart_data.state} Mobility`,
                titlefont:{
                    size:'10px'
                },
                height:'300px',
                margin:{
                    t:-70,
                    b:-10,
                    r:10,
                    l:20,
                    // autoexpand:false
                },
                // autosize:false,
                legend:{
                    orientation:"h"
                },
                polar: {
                    radialaxis: {
                        angle: 90,
                        tickangle: 90,
                        visible: true,
                        range: [-1, 1.5]
                    },
                    angularaxis:{
                        showticklabels:false
                    }
                },
                showlegend: true
            }
            Plotly.newPlot('statechart', data, layout);
        }
        catch(err){
            console.log(err)
        }
    });
}
