# [Hindsight](http://apizzo1-hindsight-2020.herokuapp.com/)
**_Created by [Maria Dong](https://github.com/mariajdong), [Ryan Jones](https://github.com/Jonsey1696), [Rebecca Leeds](https://github.com/rmoesw01), & [Amber Pizzo](https://github.com/apizzo1)._**

An interactive dashboard looking back at events and occurrences in the United States that made 2020 so unique.<br><br>

**Access the deployed page [here](http://apizzo1-hindsight-2020.herokuapp.com/).**

![screenshot](/static/img/screenshot_crop.png)

## Background
From a stock market crash to a highly infectious pandemic to nationwide protests and wildfires, 2020 has been an erratic year to say the least. We wanted to visualize the year on one dashboard to quantify and analyze some major trends and their relationships over time.

## Getting Started
_If you prefer to run the dashboard on your local server, please follow the instructions below. Otherwise, you can view the deployed page [here](http://apizzo1-hindsight-2020.herokuapp.com/)._

1. Download the repo in your preferred manner.
2. Create a file called `config.py` in the `/static/js/GT-project` folder. This file should contain two API keys (that can be obtained for free):
<br>  _a._ On [Finnhub Stock API](https://finnhub.io/), go to the [Pricing](https://finnhub.io/pricing) page and select "Start Free". Set this key equal to `finnhub_API_Key`.
<br>  _b._ Sign up for an account on [Mapbox](https://www.mapbox.com/) and confirm your email. Set this key equal to `API_KEY`.
3. Set up your SQL database.
<br>  _a._ Setup for database schemata is located in `/SQL_Queries/table_schemata.sql`.
<br>  _b._ Import `.csv` files located in `/static/Resources` to their respective tables in pgAdmin.
<br>  _c._ SQL queries are also available in `/SQL_Queries/alchemy_queries.sql` for what you may need for various visualizations.
4. In pgAdmin, use `dictBuilder()` to pass keys to `db` response to format manipulable data.
5. Run `app.py` in your terminal by using the following command:
```
$ python app.py
```

## Resources, Libraries, & Tools

**Data sources:**
* [COVID Tracking Project](https://covidtracking.com/) for national & state data on COVID-19
* [FiveThirtyEight](https://projects.fivethirtyeight.com/trump-approval-ratings/) for President Trump's approval ratings
* [Getty Images](https://www.gettyimages.com/editorial-images) for 5-image slideshows for each month
* [New York Times](https://www.nytimes.com/) (NYT) for front page headlines & images
* [Armed Conflict Location & Event Data Project](https://acleddata.com/special-projects/us-crisis-monitor/) (ACLED) for protest location & times
* [National Interagency Fire Center](https://data-nifc.opendata.arcgis.com/) (NIFC) for data on the spread & containment of wildfires
* [Opportunity Insights Economic Tracker](https://github.com/OpportunityInsights/EconomicTracker) for national & state mobility data
* [U.S. Bureau of Labor Statistics](https://www.bls.gov/) via [FRED, Federal Reserve Bank of St. Louis](https://fred.stlouisfed.org/series/UNRATE) for monthly national & state unemployment data
* [Finnhub Stock API](https://finnhub.io/) for stock data

**Libraries:**
* [noUIslider](https://refreshless.com/nouislider/), [wNumb](https://github.com/leongersen/wnumb/releases) for slider build & optimization
* [Leaflet](https://leafletjs.com/index.html), [Leaflet PointInPolygon](https://github.com/hayeswise/Leaflet.PointInPolygon), [Leaflet Heat Map](https://github.com/Leaflet/Leaflet.heat), [Leaflet US Choropleth](https://leafletjs.com/examples/choropleth/us-states.js), [Mapbox](https://docs.mapbox.com/api/maps/#styles) for mapping
* [Font Awesome](https://fontawesome.com/) for map icon symbols
* [Plotly for JavaScript](https://plotly.com/javascript/), [amCharts](https://www.amcharts.com/), [jQuery Sparklines](https://omnipotent.net/jquery.sparkline/) for charting visualizations
* [moment.js](https://momentjs.com/) for time manipulation

**Tools & languages:** JavaScript, HTML, CSS, Python Flask, Jupyter Notebook, PostgreSQL

**Website layout:** Built from [Material Kit](https://github.com/creativetimofficial/material-kit)

## Features
After running the Flask application, begin exploring the data by dragging the timeline slider and selecting a date at the upper-right corner of the page. This slider will continue to be available at the top of the page even after scrolling down. Below, you should see the visualizations respond.

The image at the top of the page and the headline will reflect the **New York Times front page article**. More images are available in a five-image **Getty Images slideshow** that changes based on the month of the selected date.

**Presidential approval and disapproval ratings** are fully visible and interactive, and the selected date is emphasized.

**Ongoing wildfires, contained wildfires, and protests** can be viewed and toggled on the interactive map. State borders are also visible and hoverable. If a state is clicked, the panel next to it will populate **state-specific information** on COVID-19 growth, unemployment, and baseline changes in mobility, all specific to the selected date. A table below the map will display the total contained/active fires and total protests on the selected date, both nationally as well as for the selected state. *Note*: the map may require additional loading time.

**National COVID-19 data** can be viewed by daily case increases or total cases and deaths up to the selected date. The mixed bar/line graph can be hovered over for details.

**National average change in mobility** is displayed in a polar area chart. The radial axis corresponds to the factor of increase in activity from baseline measurements in January/February 2020. For example, a  section with a radial value of _0.7_ represents a _70% increase_ in activity, while a value of _0_ represents _no change_ in activity.

**Select stock prices** are displayed in a line graph with the selected date highlighted, where they can be compared with up to two other stocks via dropdown menus.

Finally, **national unemployment rates** are displayed by month. The national average is shown first. Other demographic comparisons can be toggled via the legend below.

## Analyses & Discussion
As a whole, our dashboard is equipped for you to draw numerous observations about interrelations among each of our featured sections. Given the vast amount of available trends, it is impractical to analyze every significant pattern. As such, we've only listed a handful of noteworthy examples of interrelations that we observed, but we encourage you all to go through the timeline and explore the data yourselves.

**Select analyses:**

* On **March 4**, the NYT headline discusses the limitation of U.S. travel to Europe, while we can also see that the stocks for Boeing, Delta Airlines, & Southwest Airlines (all aviation-related) begin to sharply decrease. A slight recovery in these stocks can be observed on **March 22**, while the NYT headline contains the announcement of a federal bond-buying plan.
* The coronavirus stimilus relief bill was passed on **March 12** as indicated by the NYT headline, which among other things, distributed $1,200 to all American citizens. This date correlates with a peak in President Trump's approval rating.
* On **April 12**, the NYT headline highlights Governor Andrew Cuomo of New York announcing that "the worst is over", referring to COVID-19 in his state. His statement does correlate with the beginning of a continuing downward trend of COVID cases in New York, as well as the downward trend of the first peak in U.S. cases. Later, towards **July 15**, we can see that the U.S. COVID cases reach a much higher second peak in growth, while NY has no discernible peak in its sparkline at that time.
* The impact of the events in the **May 28** NYT headline, "Ex-Officer Charged in Death of George Floyd in Minneapolis", can be seen in the map when viewing the protests on that day, specifically in Minnesota. On dates & states with higher volumes of protests, we can also see a higher increase in park mobility, confirming consistency in our data.
* **September 1** shows an increase in President Trump's approval rating, just as the CDC promises a COVID vaccine by November 2020, as seen in the NYT headline.

## Future Considerations
Some tasks we'd like to build on in future commits:
* Making a loading screen for better transition when data is loading
* Incorporating animation using anime.js
* Optimizing SQL databases to integrate data more effectively and to pull data more efficiently
* Incorporating media queries to make the dashboard responsive to different screen sizes
* Allowing the user to select how to view the national unemployment data 
* Finding more quantifiable/manageable data for tags trending online, air pollution (to add to our map), hate crimes, & other possibly interesting analyses
* Broadening our scope of observation by allowing users to select a range of dates (rather than a single date), & exploring global data 
