const app = getApp();
const testDistance = [{ shopid: "4", distance: 9025.84 },
  { shopid: "5", distance: 10705.4 },
  { shopid: "6", distance: 9278.22 },
  { shopid: "7", distance: 9618.69 },
  { shopid: "8", distance: 9618.69 },
  { shopid: "9", distance: 9618.69 },
  { shopid: "10", distance: 9618.69 },
  { shopid: "11", distance: 9618.69 },
  { shopid: "12", distance: 10668.76 },
  { shopid: "13", distance: 10705.4 },
  { shopid: "14", distance: 10705.4 },
  { shopid: "15", distance: 10705.4 },
  { shopid: "16", distance: 10705.4 },
  { shopid: "17", distance: 9114.62 },
  { shopid: "18", distance: 9114.62 },
  { shopid: "19", distance: 9114.62 },
  { shopid: "20", distance: 9114.62 },
  { shopid: "21", distance: 8921.08 },
  { shopid: "22", distance: 9025.84 },
  { shopid: "23", distance: 9025.84 },
  { shopid: "24", distance: 9025.84 },
  { shopid: "25", distance: 9025.84 },
  { shopid: "26", distance: 9025.84 },
  { shopid: "27", distance: 10034.92 },
  { shopid: "28", distance: 10668.76 },
  { shopid: "29", distance: 10668.76 },
  { shopid: "30", distance: 10668.76 },
  { shopid: "31", distance: 10668.76 },
  { shopid: "32", distance: 10668.76 },
  { shopid: "33", distance: 10668.76 },
  { shopid: "34", distance: 10668.76 }];

const saveAddress = (latitude, longitude) => {
  // console.log('---------------------------------');
  // console.log(latitude, longitude)
  wx.request({
    url: `${app.globalData.api}common/ext_distance?start=${latitude},${longitude}`,
    success: res => {
      //获取位置成功 保存入本地存储
      wx.setStorage({
        key: 'distances',
        data: testDistance
      });
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
      // saveAddress(res.latitude, res.longitude);
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
      // saveAddress(res.latitude, res.longitude);

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