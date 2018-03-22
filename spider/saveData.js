var mongodb = require('./db')
var superagent = require('superagent');
var async = require('async');
var com=require('./marge')

let datas=[];
let length
function save(urls,city,position,option,pages,callback){
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
                }
                if(page==pages){
                  com.marge(city,position,datas);
                }
                callback(null, 'success');
           })
}

exports.save=save;
