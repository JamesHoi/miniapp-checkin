const app = getApp();

Page({
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: '管理员界面'
    })
  },
  bindScan: function(){
    wx.redirectTo({
      url: './scan_mac/index',
    })
  },
  bindReCheckin: function(){
    wx.redirectTo({
      url: './recheck/index',
    })
  },
  bindHistory: function(){
    wx.redirectTo({
      url: './history/index',
    })
  }
})