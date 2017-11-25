const app = getApp();

const saveAddress = (latitude, longitude) => {
  console.log('---------------------------------');
  console.log(latitude, longitude)
  wx.request({
    url: `${app.globalData.api}common/ext_distance?start=${latitude},${longitude}`,
    success: res => {
      console.log(res);
    }
  })
}

//选取地址
let chooseAddress = (self, app) => {
  //获取地址
  wx.chooseLocation({
    success: res => {
      wx.setStorage({
        key: 'address',
        data: res.name != '' ? res.name : res.address
      });
      app.globalData.address = res.name;
      self.setData({
        address: res.name
      });
      saveAddress(res.latitude, res.longitude);
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
      console.log('++++++++++++++++++++++++++++++++++')
      saveAddress(res.latitude, res.longitude);

      console.log(res);
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