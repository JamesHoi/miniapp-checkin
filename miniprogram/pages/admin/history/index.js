// pages/admin/history/index.js
Page({


  data: {
    listData: []
  },

  onLoad: function () {
    var that = this;
    wx.cloud.callFunction({
      name: "search",
      data:{mode: "re_history"},
      success: function(res){
        console.log("获取补签记录成功");
        console.log(res);
        that.setData({listData:res.result});
      }
    })
  },
})