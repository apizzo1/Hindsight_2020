// data from https://projects.fivethirtyeight.com/trump-approval-ratings/

// date = moment('9/20/2020', 'MM/DD/YYYY').format ('MM-DD-YYYY')
// console.log (date);

d3.csv ('https://projects.fivethirtyeight.com/trump-approval-data/approval_topline.csv').then ((response) => {
    // console.log (response[0].modeldate);

    var approvals = [];
    var disapprovals = [];
    var dates = [];

    for (var x = 0; x < response.length; x++) {
        var date = response[x].modeldate

        var approval = response[x].approve_estimate;
        var disapproval = response[x].disapprove_estimate;

        approvals.push (approval);
        disapprovals.push (disapproval);
        dates.push (date);

        if (date == '1/1/2020') {
            break;
        }
    }

    // console.log (dates);
    

})