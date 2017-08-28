var mongodb = require('./db')
var async = require('async');

function marge(city,position,datas){
  mongodb.open((err,db)=>{
     if(err){
       console.log('连接失败')
     }
     console.log('连接成功',position);
     db.collection(position,(err,collection)=>{
        if(err){
          mongodb.close();
          console.log(err)
        }
        collection.insertMany(datas,(err,result)=>{
           mongodb.close();
           if(err){
             mongodb.close();
           }else{
             console.log('数据已保存');
             setTimeout(function(){
               computed(city,position,datas.length)
             },2000)
           }
        })
     })
 })
}
function computed(city,position,total){
  let shanghai=['虹口区','杨浦区','闵行区','浦东新区','徐汇区','长宁区','青浦区','松江区','静安区','黄浦区','普陀区','嘉定区','奉贤区','宝山区'];
  let posiCom={};
  let ok=0;
  mongodb.open((err,db)=>{
     if(err){
       console.log('连接失败')
     }
     console.log('连接成功2');
     async.series([
       (done) => {
         let i=1
        db.collection(position,(err,collection)=>{
            if(err){
              mongodb.close();
            }
            shanghai.forEach((ele)=>{
              collection.find({district:ele}).toArray((err,arr)=>{
                 if(err){
                   mongodb.close();
                 }else{
                   posiCom[ele]=arr.length;
                   if(i==shanghai.length) done(null,posiCom)
                   i+=1
                 }
              })
            })
         })
       },
       (done) => {
         console.log('computed')
         let computed={
           city:city,
           position:position,
           poTotal:total,
           cityComposition:shanghai,
           posiCom:posiCom
         };
         db.collection(position+'Com',(err,collection)=>{
            if(err){
              mongodb.close();
            }
            collection.insert(computed,{safe:true},(err,result)=>{
              mongodb.close();
              if(err){
                mongodb.close();
              }else{
                ok=1
                done(null,ok)
              }
            })
         })
       }
     ],(err,result) =>{
        if(ok) console.log('数据统计成功2')
     })
 })
}
exports.marge=marge;
