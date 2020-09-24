create table "headlines" (
	"index" int NOT NULL,
	"date" varchar NOT NULL,
	"img_url" varchar NOT NULL,
	"headline" varchar NOT NULL,
	"article_url" varchar NOT NULL);
	
create table "national_mobility" (
	"year" int NOT NULL,
	"month" int NOT NULL,
	"day" int NOT NULL,
	"gps_retail_and_recreation" float NOT NULL,
	"gps_grocery_and_pharmacy" float NOT NULL,
	"gps_parks" float NOT NULL,
	"gps_transit_stations" float NOT NULL,
	"gps_workplaces" float NOT NULL,
	"gps_residential" float NOT NULL,
	"gps_away_from_home" float NOT NULL
);

create table "state_ids" (
	id int NOT NULL,
	state varchar NOT NULL,
	state_abbrev varchar NOT NULL,
	population_2019 int NOT NULL,
	PRIMARY KEY (id)
);

create table "state_mobility"(
	"year" int NOT NULL,
	"month" int NOT NULL,
	"day" int NOT NULL,
	id int NOT NULL,
	"gps_retail_and_recreation" float NOT NULL,
	"gps_grocery_and_pharmacy" float NOT NULL,
	"gps_parks" float NOT NULL,
	"gps_transit_stations" float NOT NULL,
	"gps_workplaces" float NOT NULL,
	"gps_residential" float NOT NULL,
	"gps_away_from_home" float NOT NULL
);

create table "state_cases"(
	"year" int,
	"month" int,
	"day" int,
	id int not null,
	"case_count" int,
	"new_case_count" int
);

create table "protest_data"(
	"iso" int,
	"event_id_cnty" varchar,
	"event_id_no_cnty" int,
	"event_date" date,
	"year" int,
	"time_precision" int,
	"event_type" varchar,
	"sub_event_type" varchar,
	"actor1" varchar,
	"assoc+actor_1" varchar,
	"inter1" int,
	"actor2" varchar,
	"assoc_actor_2" varchar,
	"inter2" int,
	"interaction" int,
	"region" varchar,
	"country" varchar,
	"admin1" varchar,
	"admin2" varchar,
	"admin3" varchar,
	"location" varchar,
	"latitude" float,
	"longitude" float,
	"geo_precision" int,
	"source" varchar,
	"source_scale" varchar,
	"fatalities" varchar
);
create table "ui_rate"(
	"date" varchar,
	"unrate" float,
	"16-19" float,
	"over20" float,
	"africanamer" float,
	"latinx" float,
	"white" float,
	"men" float,
	"women" float,
	"no_hs_grad" float,
	"hs_no_college" float,
	"bachelors" float,
	"masters" float,
	"doctoral" float
);