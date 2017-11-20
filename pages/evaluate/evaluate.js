// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
  },

  evaluate(e) {
    this.setData({
      score: Number(e.currentTarget.id)
    });
  }

})