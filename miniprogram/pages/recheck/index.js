const app = getApp();
const checkin = require("../include/checkin.js");

Page({
  data:{
    modalHidden: true,
    listData: []
  },
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: '查看记录&补签'
    });
    checkin.getRecord(this).then(result=>{this.setData({listData:app.globalData.recordList});});
    console.log(this.data.listData);
  },
  bindReCheckin: function(){
    this.setData({modalHidden: false})
  },
  modalCancel: function(){
    this.setData({modalHidden: true})
  },
  modalConfirm: function(){
    this.setData({modalHidden: true})
  },
})