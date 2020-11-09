// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

   //判断mac
  var count = 0;
  for (var i=0;i<event.wifiList.length;i++){
    var wifiList = (await db.collection("wifi").where({BSSID:event.wifiList[i].BSSID}).get()).data;
    if(wifiList.length)count++;
    if(count>=8)break;
  }
  if(count<8)return false;
  else if(event.mode == "checkLocation")return true;
  
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

  var date = new Date();
  var time = PrefixInteger(date.getHours(),2)+":"+PrefixInteger(date.getMinutes(),2)+":"+PrefixInteger(date.getSeconds(),2);
  db.collection("checkin").add({
    data:{
      openid: wxContext.OPENID,
      date: today,
      time: time,
      location: event.location,
      nickname: event.nickname,
      checkin_mode: event.checkin_mode,
      is_recheck: event.is_recheck
    }
  })
  
  //计算已连续多少天
  var cal =  db.collection("caltime");
  var record = cal.where({openid: wxContext.OPENID});
  var data = (await record.get()).data;
  if(!data.length){
    cal.add({
      data:{
        openid: wxContext.OPENID,
        date: today,
        time: time,
        count: 0
      }
    })
  }else if(today!=data[0].date){
    record.update({
      data:{
        date: today,
        time: time,
        count: 0
      }
    })
    return true;
  }else{
    var date1 = new Date(data[0].date+" "+data[0].time);
    var date2 = new Date(today+" "+time);
    var count_time = (date2-date1)+data[0].count;
    if(count_time>=1000*60*60*3){
      record.remove();
      db.collection("record").add({
        data:{
          openid: wxContext.OPENID,
          nickname: event.nickname,
          date: today,
          student_id: event.student_id
        }
      })
      //calcount
      cloud.callFunction({
        name: 'calcount',
        data: {student_id:event.student_id}
      })
      return 1;
    }else{
      record.update({
        data:{
          date: today,
          time: time,
          count: event.checkin_mode == 2 ? count_time : data[0].count
      }})
    }
  }
  return true;
}