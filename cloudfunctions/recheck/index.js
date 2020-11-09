// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //判断是否是管理员
  var data = (await db.collection("users").where({
    openid: wxContext.OPENID
  }).get()).data;
  var is_Admin = data[0].isAdmin;
  if(!is_Admin)return data;
  
  db.collection("record").add({
    data:{
      openid: wxContext.OPENID,
      student_id: event.student_id,
      date: event.date
    }
  });

  function genDate(input_date){
    var date = new Date(Date.parse(input_date));
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    return Y+"-"+M+"-"+D;
  }
  var today = genDate(new Date());
  function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }
  var date = new Date().toLocaleString("zh-cn", {timeZone: "Asia/Shanghai"});
  var date = new Date(date);
  var time = PrefixInteger(date.getHours(),2)+":"+PrefixInteger(date.getMinutes(),2)+":"+PrefixInteger(date.getSeconds(),2);

  db.collection("recheck").add({
    data:{
      openid: wxContext.OPENID,
      student_id: event.student_id,
      date: event.date,
      history_date: today,
      time: time
    }
  });
  
  cloud.callFunction({
    name: 'calcount',
    data: {student_id:event.student_id}
  });
  return true;
}