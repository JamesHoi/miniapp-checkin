// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  var date = new Date(Date.parse(new Date()));
  var Y =date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
  var today = Y+"-"+M+"-"+D;

  if(event.mode == "users"){
    return db.collection('users').where({
      openid: wxContext.OPENID
    }).get()
  }else if(event.mode == "record"){
    var today_checkin = db.collection("checkin").where({openid: wxContext.OPENID}).get();
    var success = (await db.collection("record").where({
      student_id: event.student_id,
      date: today
    }).get()).data.length;
    var data = (await today_checkin).data;
    var is_lastday = false;
    if(data.length>0)is_lastday = data[data.length-1].date == today;
    return {record:data,checkin_today:success,is_lastday:is_lastday};
  }
  else if(event.mode == "ranking"){
    return (await db.collection("ranking").orderBy("count","desc").get()).data;
  }
  else if(event.mode == "re_history"){
    return (await db.collection("recheck").get()).data;
  }
}