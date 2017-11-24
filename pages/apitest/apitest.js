// pages/apitest/apitest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // get 请求
    wx.request({
      method: 'POST',
      url: 'https://www.91tuoguan.cn/index.php/api/shop/test',
      data: {
        param1: 'parameter1',
        param2: 'parameter2'
      },
      success: function (res) {
        console.log(res.data)
      }
    });


    // post 请求
    // wx.request({
    //   method: 'POST',
    //   url: 'https://www.91tuoguan.cn/index.php/api/shop/test',
    //   data: {
    //     param1: 'parameter1',
    //     param2: 'parameter2'
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   }
    // });



    // 打开地图
    // wx.openLocation({
    //   latitude: 34.78620815535416,
    //   longitude: 113.68358266445924,
    //   scale:18,
    //   success(){
    //     console.log('success');
    //   },
    //   fail(){
    //     console.log('fail');
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})