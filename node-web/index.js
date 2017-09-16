var express=require("express");
var path=require("path");
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var app=express()
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/datas?*',function(req,res){
  let computes=[];let i=0;
  let city=req.query.city;
  console.log(city)
  var mongodb = new Db('pachong', new Server('localhost', 27017),{safe: true});
  mongodb.open(function(err,db) {
     if(err) mongodb.close();
     /*db.listCollections().toArray(function(err, collections){
       let comArray=[];
       for(let j=0;j<collections.length;j++){
         let collName=collections[j].name;
         if(collName.match('Com')){
           comArray.push(collName);
         }
       }
       comArray.forEach(function(collName){
            db.collection(collName).find({city:'上海'}).toArray(function(err,arr){
              computes=computes.concat(arr)
              if(computes.length==comArray.length) res.send(computes)
            })
       })*/
       db.collection('positionCom').find({city:city}).toArray(function(err,arr){
         if(err) mongodb.close();
         console.log('123');
         res.send(arr);
         mongodb.close();
       })
     })
  })

app.listen(8090,function(){
  console.log('Express server listening on port 8090')
})
