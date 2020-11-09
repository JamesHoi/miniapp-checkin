// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  function genDate(input_date){
    var date = new Date(Date.parse(input_date));
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    return Y+"-"+M+"-"+D;
  }
  var count_day = 0;
  var today = genDate(new Date());


  while(true){
    var day = db.collection("record").where({
      student_id: event.student_id,
      date: genDate(new Date((new Date(today))-86400000*count_day))
    }).get()
    var data = (await day).data;
    if(!data.length)break;
    count_day++;
  }

  //查找姓名
  var nickname = (await db.collection("users").where({student_id:event.student_id}).get()).data[0].nickname;

  //上传到ranking数据库,并计算连续签到时间
  record = (await db.collection("ranking").where({name: nickname}).get());
  if(!record.data.length){
    //初始化数据
    db.collection("ranking").add({
      data:{
        name: nickname,
        count: count_day
      }
    })
  }else{
    db.collection("ranking").where({name: nickname}).update({data:{count: count_day}})
  }
  return true;
}