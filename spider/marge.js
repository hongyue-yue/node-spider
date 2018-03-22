var mongodb = require('./db')
var async = require('async');

function marge(city,position,datas){
  let cities;
  switch(city){
    case '上海':
    cities='shanghai'
    break;
    case '杭州':
    cities='hangzhou'
    break;
    case '成都':
    cities='chengdu'
    break;
  }
  mongodb.open((err,db)=>{
     if(err){
       console.log('连接失败')
     }
     console.log('连接成功',position);
     db.collection(cities+position,(err,collection)=>{
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
  let cities,area;
  switch(city){
    case '上海':
    cities='shanghai';
    area=['虹口区','杨浦区','闵行区','浦东新区','徐汇区','长宁区','青浦区','松江区','静安区','黄浦区','普陀区','嘉定区','奉贤区','宝山区','金山区','崇明县']
    break;
    case '杭州':
    cities='hangzhou';
    area=['西湖区','滨江区','余杭区','拱墅区','江干区','下城区','下沙','富阳区','富阳市','临安市','桐庐县']
    break;
    case '成都':
    cities='chengdu';
    area=['高新区','武侯区','锦江区','青羊区','金牛区','成华区','郫县','双流区','双流县','新都区','龙泉驿区','温江区','崇州市','新津县','都江堰市','浦江县','彭周市','邛崃市','青白江区','金堂县','大邑县']
    break;
  }
  let year=['1-3年','3-5年','5-10年','不限'];
  let posiCom={};
  let yearCom={};
  let ok=0;
  mongodb.open((err,db)=>{
     if(err){
       console.log('连接失败')
     }
     console.log('连接成功2');
     async.series([
       (done) => {
         let i=1
        db.collection(cities+position,(err,collection)=>{
            if(err){
              mongodb.close();
            }
            area.forEach((ele)=>{
              collection.find({district:ele}).toArray((err,arr)=>{
                 if(err){
                   mongodb.close();
                 }else{
                   posiCom[ele]=arr.length;
                   if(i==area.length) done(null,posiCom)
                   i+=1
                 }
              })
            })
         })
       },
       (done) => {
         let i=1
        db.collection(cities+position,(err,collection)=>{
            if(err){
              mongodb.close();
            }
            year.forEach((ele)=>{
              collection.find({workYear:ele}).toArray((err,arr)=>{
                 if(err){
                   mongodb.close();
                 }else{
                   yearCom[ele]=arr.length;
                   if(i==year.length) done(null,posiCom)
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
           cityComposition:area,
           posiCom:posiCom,
           yearCom:yearCom
         };
         db.collection('positionCom',(err,collection)=>{
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
