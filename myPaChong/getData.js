var superagent = require('superagent');
var async = require('async');
var saveData=require('./saveData');

let option = {
  'Host':	'www.lagou.com',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.5',
  'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
  'Referer':'https://www.lagou.com/jobs/list_web?px=default&city=%E4%B8%8A%E6%B5%B7',
  'Cookie': '_ga=GA1.2.1857278882.1503572097; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1503572100,1503748936; user_trace_token=20170824185502-ae28c23d-88ba-11e7-a67f-525400f775ce; LGUID=20170824185502-ae28c6ce-88ba-11e7-a67f-525400f775ce; index_location_city=%E4%B8%8A%E6%B5%B7; JSESSIONID=ABAAABAABEEAAJA5834C0D797C1E600E076CD19341D4104; _gid=GA1.2.1694699773.1503748936; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1503749321; LGSID=20170826200216-673e31cd-8a56-11e7-b6d2-525400f775ce; PRE_UTM=m_cf_cpt_baidu_pc; PRE_HOST=bzclk.baidu.com; PRE_SITE=http%3A%2F%2Fbzclk.baidu.com%2Fadrc.php%3Ft%3D06KL00c00fATEwT01lPm0FNkUsKjml7u00000Fex4W300000YlZsWg.THL0oUhY1x60UWdBmy-bIfK15ymduyubPHPWnj0snAP9nhR0IHd7PjDYwjcLwRf4n1KDfRwDwWu7PH0knbF7wbRkwW03PsK95gTqFhdWpyfqn10zrHT3PjfsnausThqbpyfqnHm0uHdCIZwsT1CEQLILIz4_myIEIi4WUvYE5LNYUNq1ULNzmvRqUNqWu-qWTZwxmh7GuZNxTAn0mLFW5HDknjfz%26tpl%3Dtpl_10085_15730_1%26l%3D1055317918%26attach%3Dlocation%253D%2526linkName%253D%2525E6%2525A0%252587%2525E9%2525A2%252598%2526linkText%253D%2525E3%252580%252590%2525E6%25258B%252589%2525E5%25258B%2525BE%2525E7%2525BD%252591%2525E3%252580%252591%2525E5%2525AE%252598%2525E7%2525BD%252591-%2525E4%2525B8%252593%2525E6%2525B3%2525A8%2525E4%2525BA%252592%2525E8%252581%252594%2525E7%2525BD%252591%2525E8%252581%25258C%2525E4%2525B8%25259A%2525E6%25259C%2525BA%2526xp%253Did%28%252522m2a05d072%252522%29%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FH2%25255B1%25255D%25252FA%25255B1%25255D%2526linkType%253D%2526checksum%253D164%26ie%3Dutf-8%26f%3D3%26tn%3Dbaidu%26wd%3D%25E6%258B%2589%25E5%258B%25BE%25E7%25BD%2591%26oq%3DRobomongo%252520ubuntu16.04%26rqlang%3Dcn%26inputT%3D1840953%26prefixsug%3Dlagou%26rsp%3D0; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2F%3Futm_source%3Dm_cf_cpt_baidu_pc; LGRID=20170826200840-4c6f12d9-8a57-11e7-b6d8-525400f775ce; X_HTTP_TOKEN=08b8f61c335b7492c0d91fe8ecbb07f9; TG-TRACK-CODE=search_code; SEARCH_ID=bd9b230ff21d4ce8a8b2c542c394e763'
};
function getData(city, position){
  let ok = 0;
  let page = 1;
  let urls = [];
  let url='https://www.lagou.com/jobs/positionAjax.json?px=default&city='+city+'&needAddtionalResult=false&isSchoolJob=0';
  option['Referer']='https://www.lagou.com/jobs/list_'+position+'?px=default&city=%E4%B8%8A%E6%B5%B7';
  console.log(city,position)
  async.series([
     (cb) => {
       superagent
          .post(url)
          .send({
                    'pn': page,
                    'kd': position,
                    'first': false
                 })
           .set(option)
           .end((err, res) => {
               if(err) console.log(err)
               let dataObj = JSON.parse(res.text);
               if (dataObj.success === true) {
                   console.log('数据获取成功');
                   page=dataObj.content.positionResult.totalCount;
                   cb(null, page);
               } else {
                   console.log('获取数据失败,' + res.text);
               }
           });
     },
     (cb)=>{
       for (let i = 1; i <= Math.ceil(page / 15); i++) {
           urls.push({url:'https://www.lagou.com/jobs/positionAjax.json?px=default&city='+city+'&needAddtionalResult=false&isSchoolJob=0',page:i})
       }
       console.log(`${city}的${position}职位共${page}条数据，${urls.length}页`);
       cb(null, urls);
     },
     (cb)=>{
       async.mapLimit(urls, 3, (url, callback) => {
           saveData.save(url,city,position,option,callback);
       }, (err, result) => {
           if (err) throw err;
           if (result) {
               ok = 1;
           }
           cb(null, ok)
       });
     }
  ],(err,result) =>{
     if(ok) console.log(city+'的数据请求完成')
  })
}

exports.getData=getData;
