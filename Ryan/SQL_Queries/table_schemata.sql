create table "headlines" (
	"date" date NOT NULL,
	"img_url" varchar NOT NULL,
	"headline" varchar NOT NULL,
	"article_url" varchar NOT NULL);
	
create table "national_mobility" (
	"year" int NOT NULL,
	"month" int NOT NULL,
	"day" int NOT NULL,
	"gps_retail_and_recreation" int NOT NULL,
	"gps_grocery_and_pharmacy" int NOT NULL,
	"gps_parks" int NOT NULL,
	"gps_transit_stations" int NOT NULL,
	"gps_workplaces" int NOT NULL,
	"gps_residential" int NOT NULL,
	"gps_away_from_home" int NOT NULL
);