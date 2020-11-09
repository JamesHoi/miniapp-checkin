// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  if(event.mode == "first_login"){
    const person = db.collection("students").where({
      name: event.student_name,
      student_id: Number(event.student_id)
    }).get();
    if(!(await person).data.length)return false;
    db.collection("users").add({
      data:{
        student_name: event.student_name,
        student_id: event.student_id,
        nickname: event.nickname,
        avatarUrl: event.avatarUrl,
        openid: wxContext.OPENID,
        isAdmin: false
      }});
    return true;
  }else if(event.mode == "upload_mac"){
    db.collection("wifi").add({
      data:{
        BSSID: event.wifiData.BSSID,
        wifiData:event.wifiData
      }
    })
  }else if(event.mode == "init_ranking"){
    db.collection("ranking").add({
      data:{
        name: event.nickName,
        count: 0
      }
    })
  }
}