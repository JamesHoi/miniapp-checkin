// pages/admin/recheck/index.js
Page({

  data: {
    console_text:""
  },

  onLoad: function () {

  },

  submitFunc: function(e){
    var that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'recheck',
      data: {
        student_id: e.detail.value.id,
        date: e.detail.value.date
      },
      success: function(res){
        console.log(res);
        that.setData({console_text:"上传成功"})
      },
      fail: function(res){
        console.log(res);
        that.setData({console_text:"上传失败，请重试"})
      }
    })
  }
})