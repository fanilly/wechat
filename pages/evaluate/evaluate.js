// pages/evaluate/evaluate.js
const app = getApp(),
  api = app.globalData.api;
let id;
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
    id = options.id;
  },

  evaluate(e) {
    this.setData({
      score: Number(e.currentTarget.id)
    });
  },

  //提交评论
  handleSubmitEvaluate() {
    wx.request({
      url: `${api}order/appraise`,
      data: {
        id: id,
        score: this.data.score
      },
      success: res => {
        if (res.data) {
          wx.navigateBack({
            delta: 1
          });
        }
        console.log(res)
      }
    });
  }

})