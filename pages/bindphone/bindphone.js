const app = getApp(),
  api = app.globalData.api;

let timer, //定时器
  timediff = 5, //每次获取验证码的时间间隔
  phoneNumber; //当前输入的手机号

Page({
  data: {
    being: false, //记录获取验证码的状态 如果为真 代表正在获取
    time: 90, //倒计时
    isFocus: false
  },

  onLoad(options) {
    this.setData({
      phone: options.phone
    });
    wx.setNavigationBarTitle({
      title: options.phone ? '修改手机号' : '绑定手机号'
    });
  },

  //记录手机号
  recordPhoneNumber(e) {
    phoneNumber = e.detail.value;
  },

  //表单提交事件
  formSubmit(e) {
    let self = this,
      data = e.detail.value;
    wx.showLoading({
      title: '提交中'
    });
    //绑定手机号
    wx.request({
      url: `${api}user/mobile`,
      data: {
        userid: app.globalData.userID,
        mobile: data.phonenumber,
        passcode: data.verfcode
      },
      success: res => {
        wx.hideLoading();
        if (res.data * 1 == 1) {
          app.globalData.phone = data.phonenumber;
          //绑定成功
          wx.showToast({
            title: '绑定成功',
            image: '../../images/success.png',
            duration: 1500
          });
          wx.navigateBack({
            delta: 1
          });
        } else {
          wx.showToast({
            title: '验证码不正确',
            image: '../../images/warning.png',
            duration: 1500
          });
        }
      }
    });
  },

  //绑定倒计时事件
  handleGetVerf() {
    let self = this;
    if (!this.data.being) {
      //验证手机号码是否正确
      if (!(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(phoneNumber))) {
        wx.showModal({
          title: '温馨提示！',
          showCancel: false,
          content: '请输入正确的手机号',
          success: function(res) {
            if (res.confirm) {
              self.setData({
                isFocus: true
              });
            }
          }
        });
      } else {
        //显示倒计时
        this.setData({
          being: true
        });

        //获取验证码应该放在这里
        //大抵是就算低到尘埃里，也会在尘埃里开出花

        // 发送获取验证码请求
        wx.request({
          url: `${api}user/get_yzm`,
          data: {
            mobile: phoneNumber
          },
          success: res => {
            console.log(res);
          }
        });


        //开始倒计时
        timer = setInterval(function() {
          let tempTime = self.data.time;
          if (tempTime == 0) {
            //倒计时结束
            clearInterval(timer);
            self.setData({
              being: false,
              time: timediff
            });
            return;
          }
          self.setData({
            time: tempTime - 1
          });
        }, 1000);
      }
    }
  }
});