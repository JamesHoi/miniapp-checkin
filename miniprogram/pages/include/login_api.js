module.exports = {
  login: login,
  getUserInfo: getUserInfo
}

const app = getApp();

function login() {
  wx.cloud.callFunction({
    // 云函数名称
    name: 'login',
    success: function (res) {
      console.log("获取登录信息成功");
      console.log(res);
      app.globalData.userInfo = res.result.userInfo;
      app.globalData.openid = res.result.openid;
    },fail: console.error
  })
}

function getUserInfo(page){
  return new Promise(resolve =>{
  wx.getUserInfo({
    success: function(res) {
      wx.cloud.callFunction({
        name: 'search',
        data:{mode: "users"},
        success: function (res) {
          console.log("获取userinfo成功");
          console.log(res);
          if(!res.result.data.length)wx.redirectTo({url: '../first_login/index'});
          else{
            app.globalData.userInfo = res.result.data[0];
            page.setData({isAdmin:res.result.data[0].isAdmin})
          }
          return resolve();
        },})
    },
    fail: function(res){
      console.log("获取userinfo失败");
      console.log(res);
      wx.redirectTo({url: '../first_login/index'});
    }
  })
  })
}