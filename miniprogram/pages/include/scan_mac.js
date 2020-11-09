module.exports = {
  startWifi: startWifi,
  getWifiList: getWifiList,
  getLocation: getLocation
}

const app = getApp()

function startWifi(){
  wx.startWifi({
    success(res) {console.log(res.errMsg, 'wifi初始化成功')},
    fail: function(res){console.log(res.errMsg, 'wifi初始化失败')}
  })
}

function getWifiList(page) {
  return new Promise(resolve =>{
    //获取wifi列表
    wx.getWifiList({
      success(res) {
        wx.onGetWifiList(function(res) {
          console.log("获取WIFI列表成功");
          console.log(res);
          app.globalData.wifiList = res.wifiList;
          return resolve();
        });
      },
      fail(res) {console.log(res);}
    });
  });
}

function getLocation(){
  return new Promise(resolve =>{
  wx.getLocation({
    type: 'wgs84',
    success (res) {
      console.log("获取GPS成功");
      console.log(res);
      app.globalData.location = res;
      return resolve();
    }
   });
  });
}