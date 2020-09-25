function stateUnemployment(state, date) {
    console.log(state, date);
    // Plotly.newPlot('stateUnemp', plotData, layout);
}

var sliderDate = d3.select('#slider-date').attr('current_time');
stateUnemployment('Georgia', sliderDate);