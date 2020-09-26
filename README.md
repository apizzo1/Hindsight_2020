# Hindsight
Created by Maria Dong, Ryan Jones, Rebecca Leeds, & Amber Pizzo.

An interactive dashboard looking back at events and occurrences in the United States that made 2020 so unique.

![screenshot](/static/img/screenshot_crop.png)

## Background
From a stock market crash to a highly infectious pandemic to nationwide protests and wildfires, 2020 has been an erratic year to say the least. We wanted to visualize the year on one dashboard to quantify and analyze some major trends and their relationships over time.

## Getting Started
1. Download the repo in your preferred manner.
2. Obtain two free, required API keys:
  * On [Finnhub Stock API](https://finnhub.io/), go to the [Pricing](https://finnhub.io/pricing) page and select "Start Free".
  * Sign up for an account on [Mapbox](https://www.mapbox.com/) and confirm your email.
3. SQL Setup
  * Database Schemata - Set up for database is located within the SQL_Queries directory.
  * SQL Queries - Queries are available for what the needs might be for visualization.
4. Flask setup - Currently linked to a local postgres pgAdmin db. Use dictBuilder() to pass keys to db response to format manipulatable data.
5. Run app.py in your terminal by using command python app.py

## Resources, Libraries, & Tools

**Data sources:**
* [The COVID Tracking Project](https://covidtracking.com/) for national data on COVID-19
* [FiveThirtyEight](https://projects.fivethirtyeight.com/trump-approval-ratings/) for President Trump's approval ratings
* [Getty Images](https://www.gettyimages.com/editorial-images) for a brief slideshow
* [New York Times](https://www.nytimes.com/) for front page headlines & images
* [ACLED](https://acleddata.com/special-projects/us-crisis-monitor/) for protest location and times
* [NIFC](https://data-nifc.opendata.arcgis.com/) for data on the spread of wildfires
* [Economic Recovery Tracker](https://github.com/OpportunityInsights/EconomicTracker) for the mobility data
* [U.S. Bureau of Labor Statistics, retrieved from FRED, Federal Reserve Bank of St. Louis](https://fred.stlouisfed.org/) for all unemployment data
* [Finnhub Stock API](https://finnhub.io/) for the stock data

**Libraries:**
* [noUIslider](https://refreshless.com/nouislider/), [wNumb](https://github.com/leongersen/wnumb/releases) for slider build & optimization
* [Leaflet](https://leafletjs.com/index.html), [Leaflet PointInPolygon](https://github.com/hayeswise/Leaflet.PointInPolygon), [Leaflet Heat Map](https://github.com/Leaflet/Leaflet.heat), [Leaflet US Choropleth](https://leafletjs.com/examples/choropleth/us-states.js), [Mapbox](https://docs.mapbox.com/api/maps/#styles) for mapping
* [Font Awesome](https://fontawesome.com/) for map icon symbols
* [Plotly for JavaScript](https://plotly.com/javascript/), [jQuery Sparklines](https://omnipotent.net/jquery.sparkline/) for charting visualizations
* [moment.js](https://momentjs.com/) for time manipulation

**Tools & languages:** JavaScript, HTML, CSS, Python Flask, Jupyter Notebook, PostgreSQL

**Website layout:** [Material Kit](https://github.com/creativetimofficial/material-kit)

## Features
After running the Flask application, begin exploring the data by dragging the timeline slider and selecting a date at the upper-right corner of the page. This slider will continue to be available at the top of the page even after scrolling down. Below, you should see the visualizations respond.

The image at the top of the page and the headline will reflect the front page article of the **New York Times**. The images in the slideshow are static; just a glimpse of major photos from the year.

**Presidential approval and disapproval ratings** are fully visible and interactive, and the selected date is emphasized.

**Ongoing wildfires, contained wildfires, and protests** can be viewed and toggled on the interactive map. State borders are also visible and hoverable. If you click on a state, the panel next to it will populate state-specific values on COVID-19 growth, unemployment, and baseline changes in mobility, all specific to the selected date. A table below will display the total contained/active fires and total protests on the selected date, both nationally as well as for the selected state.

**National COVID-19 data** can be viewed by daily case increases or total cases and deaths up to the selected date. The mixed bar/line graph can be hovered over for details.

**National average change in mobility** is displayed in a polar area chart. The radial axis corresponds to the factor of increase in activity from baseline. For example, a  section with a radial value of _0.7_ represents a _70% increase_ in activity, while a value of _0_ represents _no change_ in activity.

**Select stock prices** are displayed in a line graph with the selected date highlighted, where they can be compared with up to two other stocks via dropdown menus.

Finally, **national unemployment rates** are displayed by month. Data is highlighted from the beginning of 2020 to the selected date. The national average can be compared to other populations selected from a dropdown menu.

## Our Analyses
As we looked through 2020, we noted specific dates that highlight how integrated our dashboard is:

* **March 4** New York Times headline brings out noteworthy changes seen in the Stocks line graph, specifically a sharp decrease in Boeing, Delta Airlines, Southwest Airlines stocks with a small recovery seen when Congress passed a bailout on **March 22**.
* The coronavirus stimilus relief bill was passed on **March 12** as indicated by the New York Times headline, which correlates with a peak in President Trump's approval rating.
* On **April 12**, Governor Andrew Cuomo of New York announces that "the worst is over", referring to COVID, which correlates with passing the peak of New York cases and US cases (for this timeframe).
* The impact of **May 28**'s New York Times headline "Ex-Officer Charged in Death of George Floyd in Minneapolis" can be seen in the map when viewing the protests on that day, specifically in Minnesota.
* **September 1** shows an increase in President Trump's approval rating, just as the CDC promises a COVID vaccine by November 2020, as seen in the New York Times' headline.

## Future Considerations

* Making Getty image carousel dynamic based on the date selected by the user
* Making a loading screen when data is loading
* Incorporating animation using anime.js
* Optimizing SQL databases to integrate data more effectively and to pull data more efficiently
* Incorporating media queries to make the dashboard responsive to different screen sizes
* Allowing the user to select how to view the national unemployment data 
* Finding quantifiable data for online trends and more manageable data for air pollution (to add to our map)
* Allowing user to select a range of dates, rather than a single date, and displaying global data 
