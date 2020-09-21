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