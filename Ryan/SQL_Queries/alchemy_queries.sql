-- sets up cases table for manip
select state_cases.id, state_ids.state_abbrev, state_cases.year, state_cases.month, state_cases.day
from state_cases
inner join state_ids on
state_cases.id=state_ids.id;

-- sets up mobility by state

select sm.id, si.state_abbrev, sm.year, sm.month, sm.day, sm.gps_retail_and_recreation,
sm.gps_grocery_and_pharmacy, sm.gps_parks, sm.gps_transit_stations, sm.gps_workplaces, sm.gps_residential,
sm.gps_away_from_home
from state_mobility as sm
inner join state_ids as si on
sm.id=si.id;

-- gets national mobility
select *
from national_mobility;

-- gets headlines
select *
from headlines;