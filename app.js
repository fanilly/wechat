//app.js
App({
  onLaunch: function() {
    const self = this,
      api = this.globalData.api;

    // 登录
    wx.login({
      success: res => {
        //向后台发送res.code 换取openid
        wx.request({
          method: 'GET',
          url: `${api}user/get_openid`,
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            console.log(res.data)
          }
        });
      }
    })

    wx.getUserInfo({
      withCredentials: true,
      success: res => {
        // console.log(res);
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        // console.log(res)
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        // if (this.userInfoReadyCallback) {
        //   this.userInfoReadyCallback(res);
        // }
      }
    })

  },
  globalData: {
    api: 'https://www.91tuoguan.cn/index.php/api/',
    userInfo: null,
    address: '',
    appDescription: '西峡生活第一平台'
  }
})