module.exports = {
  getRank: getRank
}

const app = getApp();

function getRank(page){
  wx.cloud.callFunction({
    // 云函数名称
    name: 'search',
    data: {mode: "ranking"},
    success: function (res) {
      console.log("获取排名信息成功");
      console.log(res);
      page.setData({rankList:res.result});
      for(var i=0;i<res.result.length;i++){
        if(res.result[i].name == app.globalData.userInfo.nickname)page.setData({checkin_count:res.result[i].count});
      }
    },fail: console.error
  })
}