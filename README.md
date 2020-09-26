# Hindsight
Created by Maria Dong, Ryan Jones, Rebecca Leeds, & Amber Pizzo.

An interactive dashboard looking back at events and occurrences in the United States that made 2020 so unique.

_maybe a screenshot here_

## Background
From a stock market crash to a highly infectious pandemic to nationwide protests and wildfires, 2020 has been an erratic year to say the least. We wanted to visualize the year on one dashboard to quantify and analyze some major trends over time.

## Getting Started
Download the repo in your preferred manner.

_SQL setup, flask setup, how to run the app, etc._

## Resources, Libraries, & Tools

**Data sources:**
* [The COVID Tracking Project](https://covidtracking.com/) for national data on COVID-19
* [FiveThirtyEight](https://projects.fivethirtyeight.com/trump-approval-ratings/) for President Trump's approval ratings
* [Getty Images](https://www.gettyimages.com/editorial-images) for a brief slideshow
* [New York Times](https://www.nytimes.com/) for front page headlines & images
* [ACLED](https://acleddata.com/special-projects/us-crisis-monitor/) for protest location and times
* [NIFC](https://data-nifc.opendata.arcgis.com/) for data on the spread of wildfires
* _anything else y'all used_

**Libraries:**
* [noUIslider](https://refreshless.com/nouislider/), [wNumb](https://github.com/leongersen/wnumb/releases) for slider build & optimization
* [Leaflet](https://leafletjs.com/index.html), [Leaflet PointInPolygon](https://github.com/hayeswise/Leaflet.PointInPolygon), [Leaflet Heat Map](https://github.com/Leaflet/Leaflet.heat), [Leaflet US Choropleth](https://leafletjs.com/examples/choropleth/us-states.js), [Mapbox](https://docs.mapbox.com/api/maps/#styles) for mapping
* [Plotly for JavaScript](https://plotly.com/javascript/), [jQuery Sparklines](https://omnipotent.net/jquery.sparkline/) for charting visualizations
* [FontAwesome](https://fontawesome.com/) for font manipulation
* [moment.js](https://momentjs.com/) for time manipulation

**Tools & languages:** JavaScript, HTML, CSS, Python Flask, PostgreSQL

**Website layout:** [Material Kit](https://github.com/creativetimofficial/material-kit)

## Features
After running the Flask application, begin exploring the data by dragging the timeline slider and selecting a date at the upper-right corner of the page. This slider will continue to be available at the top of the page even after scrolling down. Below, you should see the visualizations respond.

The image at the top of the page and the headline will reflect the front page article of the **New York Times**. The images in the slideshow are static; just a glimpse of major photos from the year.

**Presidential approval and disapproval ratings** are fully visible and interactive, and the selected date is emphasized.

**Ongoing wildfires, contained wildfires, and Black Lives Matter protests** can be viewed and toggled on the interactive map. State borders are also visible and hoverable. If you click on a state, the panel next to it will populate state-specific values on COVID-19 growth, unemployment, and baseline changes in mobility, all specific to the selected date. A table below will display the total contained/active fires and total protests on the selected date.

**National COVID-19 data** can be viewed by daily case increases or total cases and deaths up to the selected date. The mixed bar/line graph can be hovered over for details.

**National average change in mobility** is displayed in a polar area chart. The radial axis corresponds to the factor of increase in activity from baseline. For example, a  section with a radial value of _0.7_ represents a _70% increase_ in activity, while a value of _0_ represents _no change_ in activity.

**Select stock prices** are displayed in a line graph with the selected date highlighted, where they can be compared with up to two other stocks via dropdown menu.

Finally, **national unemployment rates** are displayed by month. Data is highlighted from the beginning of 2020 to the selected date.
