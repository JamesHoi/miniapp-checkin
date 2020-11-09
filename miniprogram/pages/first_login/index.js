const app = getApp()

Page({
  data:{
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    top: 150,
    text: ""
  },
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: "注册"
    })
  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({hasUserInfo: true,top: 100});
  },
  submitFunc: function(e){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'upload',
      data: {
        student_name: e.detail.value.name,
        student_id: e.detail.value.id,
        nickname: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        mode: "first_login"
      },
      success: function (res) {
        console.log(res);
        if(res.result){
          wx.cloud.callFunction({
            // 云函数名称
            name: 'upload',
            data: {
              mode: "init_ranking",
              nickName: app.globalData.userInfo.nickName
            },
            success: function(res){
              console.log(res);
            }
          })
          wx.redirectTo({url: '../index/index'});
        }
        else{
          wx.showModal({  
            title: '提示',  
            content: '请确认是否填写正确姓名以及学号',  
            success: function(res) {}  
          })  
        }
      },fail: console.error
    })
  }
})