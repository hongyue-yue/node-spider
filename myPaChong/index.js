
const requestLagou=require('./getData');

let city=["北京","上海","广州","深圳","杭州","南京","成都","西安","武汉","重庆"];
let position=["web","java","php","android","c++","python",".NET"];

if(process.argv.length === 4&&city.includes(process.argv[2])&&position.includes(process.argv[3])){
  console.log('准备开始请求' + process.argv[2] + '的' + process.argv[3] + '职位数据');
  requestLagou.getData(process.argv[2], process.argv[3]);
}else{
  console.log('请正确输入要爬取的城市和职位,正确格式为 node index 城市 职位，如 node index 上海 前端')
  console.log('城市如下：北京,上海,广州,深圳,杭州,南京,成都,西安,武汉,重庆')
  console.log('职位如下：web,java,php,android,c++,python,.NET')
}
