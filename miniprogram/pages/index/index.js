const app = getApp();
var login_api = require('../include/login_api.js');
var scan_mac = require("../include/scan_mac.js");
var checkin = require("../include/checkin.js");
var get_rank = require("../include/get_rank.js");

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    text: "检测到不在图书馆，无法打卡",
    admin_text: "",
    checkin: true,
    checkin_text: "打卡上线",
    showDialog: false,
    modalHidden: true,
    listData:[],
    rankList:[],
    isAdmin: false,
    checkin_count: 0,
    today_check: false
  },
  onLoad: function() {
    var that = this;
    login_api.getUserInfo(that).then(result=>{
      checkin.getRecord(that);
      get_rank.getRank(this);
    });
    scan_mac.startWifi();
    scan_mac.getLocation(); 
    scan_mac.getWifiList().then(result=>{checkin.checkLocaltion(that)});
    wx.setNavigationBarTitle({
      title: '打卡'
    })
    wx.getSystemInfo( {
      success: function( res ) {
        that.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });}
    });
  },
  //  tab切换逻辑
  swichNav: function( e ) {
      var that = this;
      if( this.data.currentTab === e.target.dataset.current ) return false;
      else that.setData( {currentTab: e.target.dataset.current})
      wx.setNavigationBarTitle({
        title: e.target.dataset.current == 0 ? '打卡' : "排行榜"
      })
  },
  bindChange: function( e ) {
    var that = this;
    that.setData( { currentTab: e.detail.current });
  },
  bindCheckin: function(){
    checkin.checkin(this);
  },
  bindReCheckin: function(){
    wx.redirectTo({
      url: '/pages/recheck/index',
    })
  },
  bindRefresh: function(){
    scan_mac.getWifiList().then(result=>{checkin.checkLocaltion(this)});
  },
  bindDevelop: function(){
    wx.redirectTo({url: 'https://github.com/JamesHoi'});
  },
  bindAdmin: function(){
    wx.redirectTo({
      url: '../admin/index',
    })
  },
  bindNotice: function(){
    wx.showModal({  
      title: '注意事项',  
      content: '1.打卡时需打开GPS和WIFI\n2.打卡上线后离开时需打卡下线，且当天需累计满三小时，否则当天记录无效!',  
      success: function(res) {}  
    })  
  }
})