var monkeypatch = require('monkeypatch');

(function(dirname, Router) {

  if( !Router.prototype.ratelimit ){
    try{
      var config = require( process.cwd()+'/resources/ratelimit/config.json')
      Router.prototype.ratelimitConfig = config
      Router.prototype.ratelimit = require('ratelimit-middleware')(config)
    }catch (e){
      console.log(e)
      console.log("dpd-ratelimit: error reading resources/ratelimit/config.json,  please see docs")
    }

  }  

  monkeypatch( Router.prototype, 'route', function(original, req, res){
    if( !Router.prototype.ratelimit || res.internal ) return original(req, res)

    // lets see whether we have specific urls to ratelimit 
    if( Router.prototype.ratelimitConfig && Router.prototype.ratelimitConfig.urls ){
      var ignore = true
      Router.prototype.ratelimitConfig.urls.map( function(regex){
        if( req.url.match( new RegExp(regex, "g") ) != null ) ignore = false
      })
      if( ignore ) return original(req, res)
    }

    // lets see whether we have a user
    req.username = req.session.user && req.session.user.username ?
                   req.session.user.username : 
                   "default"
    Router.prototype.ratelimit(req, res, function(err){
      if( err && err.status && err.status == 429 )
        res.end( JSON.stringify({message: "ratelimit exceeded", status:429, statusCode: 429 }), 429)
      else{
        return original(req, res)
      }
    })
  })

})( __dirname, require('deployd/lib/router') )
