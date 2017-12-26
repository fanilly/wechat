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
    totalcommission: 0.00, //立即佣金
    dismoney: 0, //再消费多可提现
    nowmoney: 0.00 //当前可提现佣金
  },
  onLoad: function(options) {
    this.setData({
      childnum: options.childnum,
      commission: options.commission,
      paiming: options.paiming,
      totalcommission: options.totalcommission
    });
    this.getNowMoney();
  },

  //获取可提现额度
  getNowMoney() {
    wx.request({
      url: `${api}buy/before_tixian`,
      data: {
        userid: app.globalData.userID
      },
      success: res => {
        this.setData({
          dismoney: res.data.dismoney,
          nowmoney: res.data.nowmoney,
          loaded: true
        });
      }
    });
  },

  //记录提现金额
  recordCommissionMoney(e) {
    commissionMoney = e.detail.value;
  },

  //提现
  handleCommission() {
    console.log(commissionMoney)
    if (!commissionMoney) { //提现金额不能为空
      wx.showToast({
        title: '金额不能为空！',
        image: '../../images/warning.png',
        duration: 2000
      });
    } else if (commissionMoney * 1 > this.data.nowmoney * 1) { //提现金额不能大于可提现佣金
      wx.showToast({
        title: '佣金不足！',
        image: '../../images/warning.png',
        duration: 2000
      });
    } else { //请求提现
      wx.showLoading();
      console.log('userID:' + app.globalData.userID);
      wx.request({
        url: `${api}buy/tixian`,
        data: {
          userid: app.globalData.userID,
          money: commissionMoney
        },
        success: res => {
          console.log(res)
          wx.hideLoading();
          if (res.data * 1 == 1) {
            wx.showModal({
              title: '温馨提示',
              content: '提现成功，工作人员将在48小时之内联系您并为您发放金额',
              success: res => {
                wx.showLoading();
                wx.request({
                  url: `${api}user/user_info`,
                  data: {
                    userid: app.globalData.userID
                  },
                  success: res => {
                    wx.hideLoading();
                    this.setData({
                      childnum: res.data.childnum,
                      commission: res.data.commission,
                      paiming: res.data.paiming,
                      totalcommission: res.data.totalcommission
                    });
                    this.getNowMoney();
                  }
                });
              }
            });
          } else {
            wx.showToast({
              title: '提现失败',
              image: '../../images/warning.png',
              duration: 2000
            });
          }
        }
      });
    }
  }
});