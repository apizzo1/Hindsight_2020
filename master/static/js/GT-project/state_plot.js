function stateUnemployment(state, date) {
    var humanSliderDate = new Date(+date);
    var month = humanSliderDate.getUTCMonth() + 1;
    
    d3.json('http://127.0.0.1:5000/api/v1.0/state_ui').then(stateData => {
    console.log(stateData);    
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
        currStateData.pop();

        stateTrace = {
            x: [1,2,3,4,5,6,7,8],
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
            'line': {'color': 'grey', dash: 'dash'},
            'showlegend': false,
        }

        plotData = [stateTrace, vertTrace];

        layout = {
            // title: "% Unemployment",
            height:"200",
            margin:{
                t:"10",
                l:"20",
                r:"20",
                b:"20"
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
function single_state_fxn(state, date) {
    function find_avg (array) {
        var sum = 0;
        for (var x = 0; x < array.length; x++) {
            sum += array[x];
        }
    
        var avg = Math.round (sum / array.length);
        return avg;
    }
    // format date; end result should be yyyymmdd for API calls
    var moment_date = moment.unix(date/1000).add(1, 'days');
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
        d3.select ('#total_cases').text(select_cases.toLocaleString('en'));
        d3.select ('#total_deaths').text(select_deaths.toLocaleString('en'));

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
