//选取地址
let chooseAddress = (self, app) => {
  //获取地址
  wx.chooseLocation({
    success: res => {
      console.log(res)
      wx.setStorage({
        key: 'address',
        data: res.name != '' ? res.name : res.address
      });
      app.globalData.address = res.name;
      self.setData({
        address: res.name
      });
    }
  })
};
//获取地址
let getAddress = (self, app) => {
  //获取定位
  wx.getLocation({
    type: 'wgs84',
    //成功获取位置
    success: function(res) {
      /**
       * 如果可以获取到地址 将获取到的地址保存入storage中
       * 否则打开地址选取页面
       */
      wx.getStorage({
        key: 'address',
        success: res => {
          app.globalData.address = res.data;
          self.setData({
            address: res.data
          })
        },
        fail: function() {
          chooseAddress(self, app);
        }
      })
    }
  });
};

module.exports = {
  chooseAddress: chooseAddress,
  getAddress: getAddress
};