const app = getApp(),
  api = app.globalData.api;
Page({
  data: {
    showPage: false,
    userInfo: {},
    info: {},
    loaded: false
  },
  onLoad() {
    if (!app.globalData.userInfo) {
      this.login();
    }
  },
  getInfo() {
    wx.request({
      url: `${api}user/user_info`,
      data: {
        userid: app.globalData.userID
      },
      success: res => {
        console.log(res)
        this.setData({
          info: res.data,
          loaded: true
        });
      }
    });
  },
  login() {
    wx.login({
      success: res => {
        this.getUserInfo();
      }
    });
  },
  //获取用户信息
  getUserInfo() {
    let self = this;
    wx.getUserInfo({
      success: res => {
        //保存用户信息
        app.globalData.userInfo = res.userInfo;
        //设置用户信息
        self.setData({
          userInfo: app.globalData.userInfo,
          showPage: true
        });
        this.getInfo();
      },
      fail() {
        //显示模态框
        wx.showModal({
          title: '温馨提示',
          content: '必须授权之后才能操作，是否现在进行授权？',
          success: res => {
            if (res.confirm) { //如果点击确定
              //打开设置
              wx.openSetting({
                success: res => {
                  //如果用户允许授权
                  if (res.authSetting['scope.userInfo']) {
                    self.getUserInfo();
                  } else { //如果用户依然拒绝授权
                    //跳转到首页
                    wx.switchTab({
                      url: '/pages/index/index'
                    });
                  }
                }
              });
            } else if (res.cancel) { //如果点击取消
              //跳转到首页
              wx.switchTab({
                url: '/pages/index/index'
              });
            }
          }
        });
      }
    });
  },

  //当页面显示
  onShow() {
    if (!app.globalData.userInfo) {
      this.login();
    } else {
      this.setData({
        showPage: true
      });
      this.getInfo();
    }
    //设置用户信息
    if (app.globalData.userInfo && this.data.userInfo != app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  },

  handleGoToQRCode() {
    wx.navigateTo({
      url: `../qrcode/qrcode?qrcodeurl=${this.data.info.rqcode}&avatarurl=${this.data.userInfo.avatarUrl}`
    });
  }
})