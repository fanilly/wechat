//app.js
import updateUserInfo from './utils/updateuserinfo';
App({
  onLaunch: function(options) {
    console.log(options);
    wx.showLoading({
      mask: true,
      title: '加载中'
    });
    const api = this.globalData.api;
    this.login(); //登陆
  },

  // 登录
  login() {
    const api = this.globalData.api;
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
            'content-type': 'application/json'
          },
          success: res => {
            this.globalData.userID = res.data;
            if (this.globalData.parentID) {
              wx.request({
                url: `${api}user/modify_parentid?userId=${res.data}&parentId=${this.globalData.parentID}`,
                success: res => {
                  console.log(res);
                }
              });
            }
            wx.request({
              url: `${api}user/user_info?userid=${res.data}`,
              success: res => {
                this.globalData.phone = res.data.phone;
              }
            });
            wx.hideLoading();
            this.getUserInfo();
          }
        });
      }
    });
  },

  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        console.log(res);
        let userInfo = res.userInfo,
          api = this.globalData.api,
          userID = this.globalData.userID;
        //保存用户信息
        this.globalData.userInfo = userInfo;
        console.log('-----------------------------');

        console.log('-----------------------------');
        if (userID) {
          console.log('987654321*********************');
          updateUserInfo(userInfo, api, userID);
        }
      },
      fail() {
        console.log('getUserInco fail');
      }
    });
  },

  globalData: {
    userID: '',
    parentID: '',
    phone: '',
    api: '/index.php/api/',
    imgUrl: '/',
    userInfo: null,
    address: '',
    appDescription: '武陟生活第一平台'
  }
});