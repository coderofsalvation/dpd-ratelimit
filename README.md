ratelimit incoming requests based on ip or user

![Build Status](https://travis-ci.org/coderofsalvation/dpd-ratelimit.svg?branch=master)

<img src="https://media.giphy.com/media/GzS9F4X206zle/giphy.gif" width="150" style="width:150px"/>

## Usage 

		$ npm install dpd-ratelimit dpd-event

Now in the dashboard add an event-resource called `/ratelimit` 

<img src="https://raw.githubusercontent.com/coderofsalvation/dpd-ratelimit/master/screenshot.png"/>

and add this config (`resources/ratelimit/config.json`):

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

In case you have a frontend (`/public`), specify an `urls`-section as described below.

see [here](https://github.com/defunctzombie/ratelimit-middleware) for all ratelimiting options

## Userbased ratelimiting

Use a config like this, to allow certain usernames to override the default settings (0=unlimited):

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

## Ratelimiting specific url regexes 

By defaults ratelimiting is applied to *everything* .
You'll probably agree that a frontend (`/public`) is not suitable for rateliming.
In those cases you want to add `urls` to your config, to specify which urls should be ratelimited:

    {
      "username":true,
      "urls": [ "^/foo($|/)" ], 
      "rate": 0.1,
      "burst": 1,
      "overrides": {
        "john": {
          "rate": 0,
          "burst": 0
        }
      }
    }

`urls` reverses ratelimiting behaviour: it ratelimits only those resources which match the regexes. In this case:

* `/foo`
* `/foo/`
* `/foo/123`

## Why 

* api-clients killing my database/cpu with requests? aint got no time for that!

