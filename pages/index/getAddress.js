module.exports = function(self,app) {
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
      wx.getStorage({
        key: 'address',
        success: res => {
          app.globalData.address = res.data;
          self.setData({
            address: res.data
          })
        },
        fail: function() {
          wx.chooseLocation({
            //获取地址成功 保存地址
            success: res => {
              wx.setStorage({
                key: 'address',
                data: res.name
              });
              app.globalData.address = res.name;
              self.setData({
                address: res.name
              });
            },
            //获取地址失败
            fail: function() {
              console.log(1)
            },
            //获取地址完成
            complete: function() {

            }
          })
        }
      })
    }
  });
}