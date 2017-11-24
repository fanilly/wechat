//app.js
App({
  onLaunch: function() {
    const self = this;
    console.log(this.globalData)
    console.log('---------------------------------')
    // 登录
    wx.login({
      success: res => {
        // console.log('---------------------------------')
        // console.log(res)
        // console.log('---------------------------------')
        // console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    wx.getUserInfo({
      success: res => {
        // console.log(res);
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        // if (this.userInfoReadyCallback) {
        //   this.userInfoReadyCallback(res);
        // }
      }
    })

  },
  globalData: {
    userInfo: null,
    address: '',
    appDescription: '西峡生活第一平台'
  }
})