// pages/building/building.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'该'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name:options.title
    })
    wx.setNavigationBarTitle({
      title: options.title
    });
  }
})