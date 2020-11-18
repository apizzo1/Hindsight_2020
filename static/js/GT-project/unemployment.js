// Function called from index.html  to build the unemployment chart
var userDate = 1577836800000;
var seriesSetSelect = "..."
// function buildLinePlot(userDate) {

am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("unemployment", am4charts.XYChart);
    chart.paddingRight = 10;

    // Flask Wrapper API call to gather the data
    // d3.json('/api/v1.0/ui_rate').then(function (unempData) {
    d3.csv('../static/Resources/UNRATE.csv').then(function (unempData) {

        var unempData2020 = [];
        for (var i = 864; i < unempData.length; i++) {
            unempData2020.push(unempData[i])
        }

        chart.data = unempData2020;

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.dateFormatter = new am4core.DateFormatter();
        dateAxis.dateFormatter.dateFormat = "MMM";
        // dateAxis.renderer.grid.template.location = 0;
        dateAxis.minZoomCount = 5;
        dateAxis.renderer.grid.template.disabled = true;
        dateAxis.renderer.labels.template.dx = 25;


        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.cursorTooltipEnabled = false;

        var unempSeries = chart.series.push(new am4charts.LineSeries());
        unempSeries.dataFields.dateX = "DATE";
        unempSeries.dataFields.valueY = "UNRATE";
        unempSeries.name = "2020"
        unempSeries.tooltipText = "unemployment rate: {valueY}";
        unempSeries.tooltip.pointerOrientation = "vertical";
        unempSeries.tooltip.background.fillOpacity = 0.5;
        unempSeries.hiddenInLegend = true;

        // Age Series
        var ageSeries = chart.series.push(new am4charts.LineSeries());
        ageSeries.name = "Age Stats"
        ageSeries.dataFields.dateX = "DATE";
        ageSeries.dataFields.valueY = 0;
        ageSeries.hiddenInLegend = false;
        ageSeries.hidden = true;

        var youngSeries = chart.series.push(new am4charts.LineSeries());
        youngSeries.dataFields.dateX = "DATE";
        youngSeries.dataFields.valueY = "16-19";
        youngSeries.name = "age 16-19"
        youngSeries.tooltipText = "age 16-19: {valueY}";
        youngSeries.tooltip.pointerOrientation = "vertical";
        youngSeries.tooltip.background.fillOpacity = 0.5;
        youngSeries.hiddenInLegend = true;
        youngSeries.hidden = true;

        var olderSeries = chart.series.push(new am4charts.LineSeries());
        olderSeries.dataFields.dateX = "DATE";
        olderSeries.dataFields.valueY = "over20";
        olderSeries.name = "age 20+"
        olderSeries.tooltipText = "age 20+: {valueY}";
        olderSeries.tooltip.pointerOrientation = "vertical";
        olderSeries.tooltip.background.fillOpacity = 0.5;
        olderSeries.hiddenInLegend = true;
        olderSeries.hidden = true;

        ageSeries.events.on("hidden", function () {
            youngSeries.hide();
            olderSeries.hide();
        });

        ageSeries.events.on("shown", function () {
            youngSeries.show();
            olderSeries.show();
        });

        // Ethnicity Series
        var ethnicSeries = chart.series.push(new am4charts.LineSeries());
        ethnicSeries.name = "Ethnicity Stats"
        ethnicSeries.dataFields.dateX = "DATE";
        ethnicSeries.dataFields.valueY = 0;
        ethnicSeries.hiddenInLegend = false;
        ethnicSeries.hidden = true;

        var AAseries = chart.series.push(new am4charts.LineSeries());
        AAseries.dataFields.dateX = "DATE";
        AAseries.dataFields.valueY = "AfricanAmer";
        AAseries.name = "African American"
        AAseries.tooltipText = "African American: {valueY}";
        AAseries.tooltip.pointerOrientation = "vertical";
        AAseries.tooltip.background.fillOpacity = 0.5;
        AAseries.hiddenInLegend = true;
        AAseries.hidden = true;

        var LXseries = chart.series.push(new am4charts.LineSeries());
        LXseries.dataFields.dateX = "DATE";
        LXseries.dataFields.valueY = "Latinx";
        LXseries.name = "Latin American"
        LXseries.tooltipText = "Latin American: {valueY}";
        LXseries.tooltip.pointerOrientation = "vertical";
        LXseries.tooltip.background.fillOpacity = 0.5;
        LXseries.hiddenInLegend = true;
        LXseries.hidden = true;

        var Wseries = chart.series.push(new am4charts.LineSeries());
        Wseries.dataFields.dateX = "DATE";
        Wseries.dataFields.valueY = "White";
        Wseries.name = "White"
        Wseries.tooltipText = "White: {valueY}";
        Wseries.tooltip.pointerOrientation = "vertical";
        Wseries.tooltip.background.fillOpacity = 0.5;
        Wseries.hiddenInLegend = true;
        Wseries.hidden = true;

        ethnicSeries.events.on("hidden", function () {
            AAseries.hide();
            LXseries.hide();
            Wseries.hide();
        });

        ethnicSeries.events.on("shown", function () {
            AAseries.show();
            LXseries.show();
            Wseries.show();
        });

        // Gender Series
        var genderSeries = chart.series.push(new am4charts.LineSeries());
        genderSeries.name = "Gender Stats"
        genderSeries.dataFields.dateX = "DATE";
        genderSeries.dataFields.valueY = 0;
        genderSeries.hiddenInLegend = false;
        genderSeries.hidden = true;

        var Mseries = chart.series.push(new am4charts.LineSeries());
        Mseries.dataFields.dateX = "DATE";
        Mseries.dataFields.valueY = "Men";
        Mseries.name = "Men"
        Mseries.tooltipText = "Men: {valueY}";
        Mseries.tooltip.pointerOrientation = "vertical";
        Mseries.tooltip.background.fillOpacity = 0.5;
        Mseries.hiddenInLegend = true;
        Mseries.hidden = true;

        var WomSeries = chart.series.push(new am4charts.LineSeries());
        WomSeries.dataFields.dateX = "DATE";
        WomSeries.dataFields.valueY = "Women";
        WomSeries.name = "Women"
        WomSeries.tooltipText = "Women: {valueY}";
        WomSeries.tooltip.pointerOrientation = "vertical";
        WomSeries.tooltip.background.fillOpacity = 0.5;
        WomSeries.hiddenInLegend = true;
        WomSeries.hidden = true;

        genderSeries.events.on("hidden", function () {
            Mseries.hide();
            WomSeries.hide();
        });

        genderSeries.events.on("shown", function () {
            Mseries.show();
            WomSeries.show();
        });

        // Education Series
        var educationSeries = chart.series.push(new am4charts.LineSeries());
        educationSeries.name = "Education Stats"
        educationSeries.dataFields.dateX = "DATE";
        educationSeries.dataFields.valueY = 0;
        educationSeries.hiddenInLegend = false;
        educationSeries.hidden = true;

        var nsHSseries = chart.series.push(new am4charts.LineSeries());
        nsHSseries.dataFields.dateX = "DATE";
        nsHSseries.dataFields.valueY = "no-HS-grad";
        nsHSseries.name = "No HS graduation"
        nsHSseries.tooltipText = "No HS graduation: {valueY}";
        nsHSseries.tooltip.pointerOrientation = "vertical";
        nsHSseries.tooltip.background.fillOpacity = 0.5;
        nsHSseries.hiddenInLegend = true;
        nsHSseries.hidden = true;

        var HSonlySeries = chart.series.push(new am4charts.LineSeries());
        HSonlySeries.dataFields.dateX = "DATE";
        HSonlySeries.dataFields.valueY = "HS-no-college";
        HSonlySeries.name = "HS, no college"
        HSonlySeries.tooltipText = "HS, no college: {valueY}";
        HSonlySeries.tooltip.pointerOrientation = "vertical";
        HSonlySeries.tooltip.background.fillOpacity = 0.5;
        HSonlySeries.hiddenInLegend = true;
        HSonlySeries.hidden = true;

        var BachSeries = chart.series.push(new am4charts.LineSeries());
        BachSeries.dataFields.dateX = "DATE";
        BachSeries.dataFields.valueY = "Bachelors";
        BachSeries.name = "Bachelors"
        BachSeries.tooltipText = "Bachelors: {valueY}";
        BachSeries.tooltip.pointerOrientation = "vertical";
        BachSeries.tooltip.background.fillOpacity = 0.5;
        BachSeries.hiddenInLegend = true;
        BachSeries.hidden = true;

        var MastSeries = chart.series.push(new am4charts.LineSeries());
        MastSeries.dataFields.dateX = "DATE";
        MastSeries.dataFields.valueY = "Masters";
        MastSeries.name = "Masters"
        MastSeries.tooltipText = "Masters: {valueY}";
        MastSeries.tooltip.pointerOrientation = "vertical";
        MastSeries.tooltip.background.fillOpacity = 0.5;
        MastSeries.hiddenInLegend = true;
        MastSeries.hidden = true;

        var DOCseries = chart.series.push(new am4charts.LineSeries());
        DOCseries.dataFields.dateX = "DATE";
        DOCseries.dataFields.valueY = "Doctoral";
        DOCseries.name = "Doctoral"
        DOCseries.tooltipText = "Doctoral: {valueY}";
        DOCseries.tooltip.pointerOrientation = "vertical";
        DOCseries.tooltip.background.fillOpacity = 0.5;
        DOCseries.hiddenInLegend = true;
        DOCseries.hidden = true;

        educationSeries.events.on("hidden", function () {
            nsHSseries.hide();
            HSonlySeries.hide();
            BachSeries.hide();
            MastSeries.hide();
            DOCseries.hide();
        });

        educationSeries.events.on("shown", function () {
            nsHSseries.show();
            HSonlySeries.show();
            BachSeries.show();
            MastSeries.show();
            DOCseries.show();
        });

        // set a minimum date (1/1/2020) to accept; use moment.js for date parsing/formatting
        if (userDate < 1577836800000) { var moment_date = moment.unix(1577836800); }
        else { var moment_date = moment.unix(userDate / 1000); }

        // format date - pull month only
        var unemp_date = moment_date.format('M');

        var range = dateAxis.axisRanges.create();
        range.date = new Date(2020, unemp_date-1, 15);
        range.grid.stroke = am4core.color("#5B5B5B");
        range.grid.strokeWidth = 2;
        range.grid.strokeOpacity = 1;
        range.grid.strokeDasharray = 8;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineY.disabled = true;
        chart.cursor.behavior = 'zoomX';

        chart.legend = new am4charts.Legend();
        chart.legend.position = "bottom";
        chart.legend.maxHeight = 100;
        chart.legend.scrollable = true;

        dateSlider.noUiSlider.on('change', function (values, handle) {
            
            // grab the date
            userDate = (values[handle]);
            
            // set a minimum date (1/1/2020) to accept; use moment.js for date parsing/formatting
            if (userDate < 1577836800000) { var moment_date = moment.unix(1577836800); }
            else { var moment_date = moment.unix(userDate / 1000); }
    
            // format date - pull month only
            var unemp_date = moment_date.format('M');
    
            range.date = new Date(2020, unemp_date-1, 15);
            range.grid.stroke = am4core.color("#5B5B5B");
            range.grid.strokeWidth = 2;
            range.grid.strokeOpacity = 1;
            range.grid.strokeDasharray = 8;
        }); // end dateSlider
    }); // end d3.csv
}); // end am4core.ready()
// }

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