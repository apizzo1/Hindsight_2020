function stateUnemployment(state, date) {
    var month=moment.unix(date/1000).format("M");
    // var humanSliderDate = new Date(+date);
    // console.log(humanSliderDate)
    // var month = humanSliderDate.getUTCMonth() + 1;

    d3.json('http://127.0.0.1:5000/api/v1.0/state_ui').then(stateData => {
        console.log(stateData);
        currStateData = [];
        for (i = 0; i < stateData.length; i++) {
            if (stateData[i].State === state) {
                const keys = Object.keys(stateData[i]);
                keys.forEach((key, index) => {
                    console.log(`${key}: ${stateData[i][key]}`);
                    currStateData.push(stateData[i][key]);
                })
            }
        }
        currStateData.pop();

        stateTrace = {
            x: [1, 2, 3, 4, 5, 6, 7, 8],
            y: currStateData,
            name: 'UI',
            type: 'area',
            fill: 'tozeroy',
            fillcolor: 'rgba(255, 0, 0, 0.1)',
        }

        maxData = Math.max(...currStateData);
        console.log(month, maxData);
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

        plotData = [stateTrace, vertTrace];

        layout = {
            // title: "% Unemployment",
            height: "200",
            margin: {
                t: "10",
                l: "20",
                r: "20",
                b: "20"
            },
            xaxis: {
                tick0: '2019-12-01',
            },
            // yaxis: {title: '%Unemployment'},
            showlegend: false,
        }

        Plotly.newPlot('stateUnemp', plotData, layout);
    });
}
<<<<<<< HEAD

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

    function find_avg (array) {
=======
function single_state_fxn(state, date) {
    function find_avg(array) {
>>>>>>> 61dc1457fe1a9bbec259edf7134954446705b506
        var sum = 0;
        for (var x = 0; x < array.length; x++) {
            sum += array[x];
        }

        var avg = Math.round(sum / array.length);
        return avg;
    }

    var state = abbrRegion(full_state, 'abbr');

    // format date; end result should be yyyymmdd for API calls
<<<<<<< HEAD
    var moment_date = moment.unix(date/1000);
=======
    var moment_date = moment.unix(date / 1000).add(1, 'days');
>>>>>>> 61dc1457fe1a9bbec259edf7134954446705b506
    var api_date = moment_date.format('YYYYMMDD');
    // var prior_date = luxon_date.plus({ days: -1 }).toFormat('yyyyLLdd');

    var state_url = `https://api.covidtracking.com/v1/states/${state}/daily.json`;

    var case_array = [];
    var date_array = [];
    var death_array = [];

    d3.json(state_url).then((response) => {
        for (var x = 0; x < response.length; x++) {
            date_array.push(response[x]['date']);
            case_array.push(response[x]['positive']);
            death_array.push(response[x]['death']);

            if (response[x]['date'] == api_date) {
                var select_cases = response[x]['positive'];
                var select_deaths = response[x]['death'];
                var select_index = x;
            }
        }

        var case_increases = [];
        for (var x = (case_array.length - 2); x > -1; x--) {
            var increase = case_array[x] - case_array[x + 1];
            case_increases.push(increase);

            if (x == select_index) {
                var select_increase = increase;
                break;
            }
        }

        // console.log(`total cases today: ${select_cases}, total deaths today: ${select_deaths}, new cases today: ${select_increase}`);
        d3.select('#total_cases').text(select_cases.toLocaleString('en'));
        d3.select('#total_deaths').text(select_deaths.toLocaleString('en'));

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

        // fxn for sparkline
        $(function () {
            $(`#state_cases`).sparkline(new_cases_avg, {
                width: '100',
                height: '30',
                minSpotColor: false,
                maxSpotColor: false,
                highlightSpotColor: 'red',
                highlightLineColor: 'red'
            });
        });
    });
}
function optionChanged(state, date) {
    d3.json('http://127.0.0.1:5000/api/v1.0/state_mobility').then(function (inputdata) {
        // format date
        var e_conv=moment.unix(date/1000).format("M/D/YYYY");
        // var e_date = new Date(+date)
        // var m = e_date.getUTCMonth() + 1
        // var d = e_date.getUTCDate()-1
        // var y = e_date.getUTCFullYear()
        // var e_conv = (m + "/" + d + "/" + y)
        console.log(e_conv)
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
                name: "Parks",
                r: [-2, chart_data.parks, chart_data.parks, -2],
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
                name: "Grocery",
                r: [-2, chart_data.grocery, chart_data.grocery, -2],
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
                name: "Transit",
                r: [-2, chart_data.transit, chart_data.transit, -2],
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
                name: "Office",
                r: [-2, chart_data.office, chart_data.office, -2],
                theta: [0, 288, 360, 0],
                fill: "toself",
                fillcolor: 'purple',
                line: {
                    color: 'black'
                }
            }
            var data = [trace1, trace2, trace3, trace4, trace5]
            var layout = {
                title: `${chart_data.state} Mobility on ${chart_data.date}`,
                polar: {
                    radialaxis: {
                        angle: 90,
                        tickangle: 90,
                        visible: true,
                        range: [-1, 1]
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
