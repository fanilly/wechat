// pages/qrcode/qrcode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    avatarUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url:options.qrcodeurl,
      avatarUrl:options.avatarurl
    });
  }
});