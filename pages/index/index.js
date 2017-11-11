//index.js
//获取应用实例
const app = getApp();
const getAddress = require('getAddress.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    windowWidth: 750, //视口宽度
    swiperHeight: 150, //swiper 高度
    address: '',
    carousel: {
      imagesUrl: ['../../images/banner-1.png', '../../images/banner-2.png'],
      indicatorDots: true, //是否显示焦点
      indicatorColor: '#eeeeee', //焦点颜色
      indicatorActiveColor: '#333333', //当前活动块焦点颜色
      autoplay: true, //自动播放
      interval: 4000, //自动播放间隔市场
      circular: true //无缝衔接
    },
    listData: [{
      productName: '一乐拉面一乐拉面一乐拉面一乐拉面一乐拉面一乐拉面一乐拉面一乐拉面',
      shopName: '一乐拉面（东大街店）ssssssssssssssssssssss',
      sale: 120,
      score: 4.8,
      price: 9.9,
      thumbnail: '../../images/pro01.png',
      shopDesc: '一乐拉面是木叶村最负盛名的拉面，木叶历经数次大战，依然存在，可见一乐的实力见一乐的实力深不可测'
    }, {
      productName: '一乐拉面',
      shopName: '一乐拉面（东大街店）',
      sale: 120,
      score: 4.8,
      price: 9.9,
      thumbnail: '../../images/pro01.png',
      shopDesc: '一乐拉面是木叶村最负盛名的拉面，木叶历经数次大战，依然存在，可见一乐的实力深不可测'
    }]
  },
  onShow() {
    console.log('index show')
  },
  onLoad() {
    let self = this;
    //获取地址
    getAddress(this, app);

    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth
        })
      }
    });
  },
  imageLoad(e) {
    //获取图片真实宽度  
    let imgwidth = e.detail.width,
      imgheight = e.detail.height,
      swiperHeight = this.data.windowWidth / imgwidth * imgheight;
    this.setData({
      swiperHeight: swiperHeight
    })
  },
  handleChoiceAddress() {
    let self = this;
    // 点击选择按钮之后打开地图选择地址
    wx.getLocation({
      type: 'wgs84',
      // 如果成功 直接选择地址
      success: res => {
        wx.chooseLocation({
          //获取地址成功 保存地址
          success: res => {
            wx.setStorage({
              key: 'address',
              data: res.name
            });
            app.globalData.address = res.name;
            self.setData({
              address: res.name
            });
          },
          //获取地址失败
          fail: res => {
            console.log(res)
          },
          //获取地址完成
          complete: function() {

          }
        })
      },
      // 如果选择失败 打开设置 重新授权
      fail: res => {
        wx.openSetting();
      }
    })

  }
})