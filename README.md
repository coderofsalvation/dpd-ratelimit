ratelimit incomsing requests based on ip or user

<img src="https://media.giphy.com/media/GzS9F4X206zle/giphy.gif" width="150" style="width:150px"/>

## Usage 

   $ npm install dpd-ratelimit dpd-event

Now in the dashboard add an event-resource called `/ratelimit` 

<img src="https://raw.githubusercontent.com/coderofsalvation/dpd-ratelimit/screenshot.png"/>

and add this config:

		{
		  "ip":true,
			"rate": 0.1,
			"burst": 1,
			"overrides": {
				"192.345.345.1": {
					"rate": 0,
					"burst": 0
				}
			}
		}

> Voila! You have automatic ratelimiting based on ip

see [here](https://github.com/defunctzombie/ratelimit-middleware) for ratelimit all options

## Userbased ratelimiting

Use a config like this:

		{
		  "username":true,
			"rate": 0.1,
			"burst": 1,
			"overrides": {
				"john": {
					"rate": 0,
					"burst": 0
				}
			}
		}

## Why 

* api-clients killing my database/cpu with requests? aint got no time for that!

## Notes 

