import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import os

from flask import Flask, jsonify, render_template
db_url = os.environ.get('DATABASE_URL', '') 
# create engine
engine = create_engine(db_url)
# reflect DB
Base=automap_base()
Base.prepare(engine, reflect = True)

# Flask init
app = Flask(__name__)

# dict_builder to take in sql response
def dict_creation(response, headers):
    response_list=[]
    for item in response:
        item_dict={}
        for i in range(0,len(headers)):
            num1=headers[i]
            item_dict[num1]=item[i]
        response_list.append(item_dict)
    return(response_list)

# home route
@app.route("/")
def welcome():
    return render_template("index.html")

@app.route("/api/v1.0/headlines")
def headlines():
    # Create our session (link) from Python to the DB

    results = engine.execute('SELECT date, img_url, headline, article_url FROM headlines').fetchall()
    # dict keys
    headers_list=['date', 'img_url', 'headline', 'article_url']

    db_response=dict_creation(results,headers_list)
    return jsonify(db_response)

@app.route("/api/v1.0/national_mobility")
def national_mobility():
    # Create our session (link) from Python to the DB

    results = engine.execute('SELECT * FROM national_mobility').fetchall()
    # dict keys
    headers_list=['year', 'month', 'day', 'retail', 'grocery', 'parks', 'transit', 'work', 'residential', 'away_from_home']

    db_response=dict_creation(results,headers_list)
    return jsonify(db_response)

@app.route("/api/v1.0/state_mobility")
def state_mobility():
    # Create our session (link) from Python to the DB

    results = engine.execute('select sm.id, si.state, sm.year, sm.month, sm.day, sm.gps_retail_and_recreation, sm.gps_grocery_and_pharmacy, sm.gps_parks, sm.gps_transit_stations, sm.gps_workplaces, sm.gps_residential, sm.gps_away_from_home from state_mobility as sm inner join state_ids as si on sm.id=si.id').fetchall()
    # dict keys
    headers_list=['id', 'state', 'year', 'month', 'day', 'retail', 'grocery', 'parks', 'transit', 'work', 'residential', 'away_from_home']

    db_response=dict_creation(results,headers_list)
    return jsonify(db_response)

@app.route("/api/v1.0/ui_rate")
def ui_rate():
    # Create our session (link) from Python to the DB

    results = engine.execute('select * from ui_rate').fetchall()
    # dict keys
    headers_list=['DATE','UNRATE','16-19','over20','AfricanAmer','Latinx','White','Men','Women','no-HS-grad','HS-no-college','Bachelors','Masters','Doctoral']

    db_response=dict_creation(results,headers_list)
    return jsonify(db_response)

@app.route("/api/v1.0/protest")
def protest():
    # Create our session (link) from Python to the DB

    results = engine.execute('select * from protest_data').fetchall()
    # dict keys
    headers_list=['ISO','EVENT_ID_CNTY','EVENT_ID_NO_CNTY','EVENT_DATE','YEAR','TIME_PRECISION','EVENT_TYPE','SUB_EVENT_TYPE','ACTOR1','ASSOC_ACTOR_1','INTER1','ACTOR2','ASSOC_ACTOR_2','INTER2','INTERACTION','REGION','COUNTRY','ADMIN1','ADMIN2','ADMIN3','LOCATION','LATITUDE','LONGITUDE','GEO_PRECISION','SOURCE','SOURCE_SCALE','FATALITIES']

    db_response=dict_creation(results,headers_list)
    return jsonify(db_response)

@app.route("/api/v1.0/state_ui")
def state_ui():
    # Create our session (link) from Python to the DB

    results = engine.execute('SELECT * FROM state_ui').fetchall()
    # dict keys
    headers_list=['State', 'January', 'February', 'March','April', 'May', 'June', 'July', 'August']

    db_response=dict_creation(results,headers_list)
    return jsonify(db_response)
if __name__ == '__main__':
    app.run(debug=True)
