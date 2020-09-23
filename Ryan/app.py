import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
# create engine
engine = create_engine('postgresql://postgres:Khaleesi3!@localhost:5432/hindsight_2020')
# reflect DB
Base=automap_base()
Base.prepare(engine, reflect = True)

# Flask init
app = Flask(__name__)

# dict_builder
def dict_creation(response, headers):
    response_list=[]
    item_dict={}
    for item in response:
        for i in range(0,len(headers)):
            num1=headers[i]
            item_dict[num1]=item[i]
        response_list.append(item_dict)
    return(response_list)

# home route
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/headlines<br/>"
        f"/api/v1.0/national_mobility"
        f"/api/v1.0/state_mobility"
        f"/api/v1.0/national_ui"
    )

@app.route("/api/v1.0/headlines")
def headlines():
    # Create our session (link) from Python to the DB

    results = engine.execute('SELECT date, img_url, headline, article_url FROM headlines').fetchall()
    # dict keys
    headers_list=['date', 'img_url', 'headline', 'article_url']

    db_response=dict_creation(results,headers_list)
    return jsonify(db_response)

if __name__ == '__main__':
    app.run(debug=True)
