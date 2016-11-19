var monkeypatch = require('monkeypatch')
var Router

var reqcount = 0
var limitcount = 0
var config = {
  username: true, 
  burst:1, 
  rate:1, 
  overrides:{
    john:{
      burst:0, 
      rate:0, 
    }
  }
}

var error = function(msg){
  console.log(msg)
  process.exit(1)
}

monkeypatch( require('module').prototype,'require', function(original, modname ){
  if( modname == 'deployd/lib/script' ){
    if( Script ) return Script
    Script = function(){}
    Script.prototype.run = function(){ }
    return Script
  }
  if( modname.match(/ratelimit\/config.json/) != null ){
    return config 
  } 
  if( modname == 'deployd/lib/router' ){
    Router = function(){}
    Router.prototype.route = function(){
      reqcount++
    }
    return Router
  }
  return original(modname)
})

// include our script
var Router = require('deployd/lib/router')
eval( require('fs').readFileSync('./index.js').toString() )

console.log("TEST (user:none,env:development) 10 reqs")
reqcount = 0
limitcount = 0
var me = { server:{ options: { env: 'development' } } }
for( var i =0; i < 10; i++ ){
  Router.prototype.route.apply( me, [{ 
    session: {                          // req
      user:false
    }
  }, {                                  // res
    res:{
      end: function(){
        console.log("end!")
      }
    } 
  }])
}
if( limitcount != 0 || reqcount != 10 ) error("reqcount not ok")

console.log("TEST (user:none, env:production) 10 reqs")
reqcount = 0
limitcount = 0
var me = { server:{ options: { env: 'production' } } }
for( var i =0; i < 10; i++ ){
  Router.prototype.route.apply( me, [{ 
    session: {                          // req
      user:false
    }
  }, {                                  // res
    end: function(){
      limitcount++
    }
  }])
}
if( reqcount != 1 || limitcount != 9 ) error("reqcount not ok")

console.log("TEST (user:john, env:production) 10 reqs")
reqcount = 0
limitcount = 0
var me = { server:{ options: { env: 'production' } } }
for( var i =0; i < 10; i++ ){
  Router.prototype.route.apply( me, [{ 
    session: {                          // req
      user:{
        username: "john"  
      }
    }
  }, {                                  // res
    end: function(){
      limitcount++
    }
  }])
}
if( reqcount != 10 || limitcount != 0 ) error("reqcount not ok")

console.log("TEST (user:john, env:development) 10 reqs")
reqcount = 0
limitcount = 0
var me = { server:{ options: { env: 'development' } } }
for( var i =0; i < 10; i++ ){
  Router.prototype.route.apply( me, [{ 
    session: {                          // req
      user:{
        username: "john"  
      }
    }
  }, {                                  // res
    end: function(){
      limitcount++
    }
  }])
}
if( reqcount != 10 || limitcount != 0 ) error("reqcount not ok")
