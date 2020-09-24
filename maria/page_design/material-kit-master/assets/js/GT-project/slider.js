// Create a new date from a string, return as a timestamp.
function timestamp(str) {
    return new Date(str).getTime();
}

console.log(timestamp("2020"));
console.log(timestamp("09-jun-2020"));

var dateSlider = document.getElementById('sliderRegular');

noUiSlider.create(dateSlider, {
// Create two timestamps to define a range.
    connect: [true, false],
    range: {
        min: timestamp('2020'),
        max: timestamp('2021')
    },

// Steps of one week
    // step: 7* 24 * 60 * 60 * 1000,

// Two more timestamps indicate the handle starting positions.
    start: timestamp('2020'),

// No decimals
    format: wNumb({
        decimals: 0
    })
});

// after user selects date, return date
dateSlider.noUiSlider.on('end', function (values, handle) {

    var date_select = values[handle];
    console.log(date_select);
    
    // source: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp*1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        var time = date + ' ' + month + ' ' + year  ;
        return time;
      }
    
    var user_selected_date = timeConverter(date_select/1000);
    // console.log(user_selected_date);
    d3.select("#date_select").text(`Pick a date to observe: ${user_selected_date}`)
    
    // console.log(date_display);

});