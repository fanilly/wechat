// pages/.js
const app = getApp(),
  api = app.globalData.api;
let commissionMoney;
Page({
  data: {
    loaded: false,
    childnum: 1, //团员
    commission: 0.00, //当前佣金
    paiming: 1, //排名
    totalcommission: 0.00 //立即佣金
  },
  onLoad: function(options) {
    this.setData({
      childnum: options.childnum,
      commission: options.commission,
      paiming: options.paiming,
      totalcommission: options.totalcommission
    });
    wx.request({
      url: `${api}buy/before_tixian`,
      data:{
        userid:app.globalData.userID
      },
      success: res => {
        console.log(res)
      }
    })
    setTimeout(() => {
      this.setData({
        loaded: true
      });
    }, 1000)
  },

  //记录提现金额
  recordCommissionMoney(e){
    commissionMoney = e.detail.value;
  },

  //提现
  handleCommission(){
    wx.request({
      url: `${api}buy/tixian`,
      data:{
        userid:app.globalData.userID,
        money:commissionMoney
      },
      success: res => {
        console.log(res)
      }
    })
  }

})