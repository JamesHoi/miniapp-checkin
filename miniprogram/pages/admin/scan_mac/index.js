const app = getApp()
var scan_mac = require("../../include/scan_mac.js");

Page({
  data: {
    status: "按扫描后会显示mac，确认就上传到服务器",
    listData: [],
    success_count: 0
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '扫描Mac'
    })
  },

  bindScan: function(){
    scan_mac.getWifiList();
    this.setData({listData:app.globalData.wifiList})
    this.setData({status:"扫描成功"})
  },

  bindUpload: function(){
    var that = this;
    that.setData({status:"正在上传"})
    console.log(this.data.listData.length);
    var data_length = this.data.listData.length;
    for (var i=0;i<data_length;i++)
    { 
      wx.cloud.callFunction({
        name: 'upload',
        data: {
          wifiData: that.data.listData[i],
          mode: "upload_mac"
        },
        success: function (res) {
          var count = that.data.success_count+1;
          that.setData({success_count: count,status: "上传成功"+String(count)+"/"+String(data_length)});
        },
        fail: function(res){
          console.log("upload error");
          console.log(res);
        }
      })
    }
  }
})