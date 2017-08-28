var mongodb = require('./db')
var superagent = require('superagent');
var async = require('async');
var com=require('./marge')

let datas=[];
let length
function save(urls,city,position,option,callback){
  let url=urls.url;
  let page=urls.page;
  superagent.post(url)
            .send({
               'pn': page,
               'kd': position,
               'first': false
            })
           .set(option)
           .end((err,res)=>{
                let dataObj = JSON.parse(res.text);
                let posts=dataObj.content.positionResult.result;
                if(posts.length){
                  datas=datas.concat(posts);
                  console.log('第'+page+'页数据已保存');
                  length=datas.length;
                }else if(datas.length==length&&!posts.length){
                  com.marge(city,position,datas);
                  length+=1;
                }
                callback(null, 'success');
           })
}

exports.save=save;
