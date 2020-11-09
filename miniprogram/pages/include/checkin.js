module.exports = {
  checkin: checkin,
  checkLocaltion: checkLocaltion,
  getRecord: getRecord
}

const app = getApp();

function checkin(page){
  return new Promise(resolve =>{
  wx.cloud.callFunction({
    // 云函数名称
    name: 'checkin',
    data: {
      wifiList: app.globalData.wifiList,
      location: app.globalData.location,
      checkin_mode: app.globalData.checkin_mode,
      nickname: app.globalData.userInfo.nickname,
      student_id: app.globalData.userInfo.student_id,
      is_recheck: false,
      mode: "checkin"
    },
    success: function (res) {
      console.log("接收到打卡反馈");
      console.log(res);
      if(res.result){
        var checkin_text = app.globalData.checkin_mode == 1 ? "打卡下线" : "打卡上线";
        var text = app.globalData.checkin_mode == 2 ? "打卡下线" : "打卡上线";
        app.globalData.checkin_mode = !(app.globalData.checkin_mode-1)+1;
        if(res.result === 1)page.setData({text:"今日打卡成功",checkin_text:"打卡已完成",checkin:true});
        else page.setData({text:text+"成功",checkin_text:checkin_text});
      }else page.setData({checkin:true,text: "检测到不在图书馆，无法打卡"});
      return resolve();
    },fail: console.error
  })
});
}

function checkLocaltion(page){
  wx.cloud.callFunction({
    // 云函数名称
    name: 'checkin',
    data: {
      wifiList: app.globalData.wifiList,
      location: app.globalData.location,
      mode: "checkLocation"
    },
    success: function (res) {
      console.log("获取到位置信息");
      console.log(res);
      if(res.result){
        page.setData({checkin:false,text: "按打卡签到"})
      }
    },fail: console.error
  })
}

function getRecord(page){
  return new Promise(resolve =>{
    wx.cloud.callFunction({
      // 云函数名称
      name: 'search',
      data: {
        mode: "record",
        student_id: app.globalData.userInfo.student_id
      },
      success: function (res) {
        console.log("获取历史记录成功");
        console.log(res);
        app.globalData.recordList = res.result.record;
        var length = res.result.record.length;
        if(!length)app.globalData.checkin_mode = 1;
        else app.globalData.checkin_mode = res.result.record[length-1].checkin_mode == 1 ? 2 : 1;
        app.globalData.today_check = res.result.success;
        if(app.globalData.today_check)page.setData({checkin: true,checkin_text: "今日已打卡成功"});
        else page.setData(
          {checkin_text: app.globalData.checkin_mode == 2 && res.result.is_lastday ? "打卡下线" : "打卡上线"});
        return resolve();
      },fail: console.error
    })
  })
}