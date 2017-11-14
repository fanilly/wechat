const app = getApp();
Page({
  data: {
    userInfo: {}
  },
  onLoad() {

  },
  onShow() {
    if (this.data.userInfo != app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  }
})