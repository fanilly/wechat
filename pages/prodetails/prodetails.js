// pages/components/prodetail/prodetails.js
import { formatDate } from '../../utils/util';

const app = getApp(),
  api = app.globalData.api;

let slideInDown, //动画实例
  latitude, //店铺所在位置的纬度
  longitude, //店铺所在位置的经度
  Distances,
  allowCollection = true;

// 购买接口

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allowScroll: false, //是否允许页面层滚动
    windowHeight: 750, //视口高度
    productNumber: 1, //商品件数
    date: '2016-09-01', //当前选择时间
    startDate: '', //开始时间
    endDate: '',
    isCollectioned: false, //是否已经被收藏
    hasCoupon: false, //是否已有优惠券 该功能暂未开发

    shopid: 1,
    goodsid: 1,
    distance: '', //距离
    address: '', //位置
    phone: '', //联系方式
    shopName: '', //店铺名称
    goodsName: '', //商品名称
    price: '', //价格
    monthSum: '', //月销
    score: '', //评分
    goodscatid: -1,
    goodsimg: '',
    loaded: false,

    slideInDown: {},
    isShowGetCoupon: false, //显示领取优惠券层
    isShowBuyLayer: false, //显示购买层

    listData: [],
    coupons: [{
      shopuniquekey: 'xx21255',
      shopname: '一乐拉面',
      denomination: 10,
      activityname: '店铺名称',
      invaliddate: '2017-11-12',
      fullcut: 100
    }]
  },

  //购买
  handleBuy() {
    if (!app.globalData.phone) {
      wx.showModal({
        title: '温馨提示',
        content: '购买商品需要先绑定手机号',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: `../bindphone/bindphone?phone=''`
            });
          }
        }
      });
    } else {
      wx.showLoading();
      wx.request({
        url: `${api}buy/buy`,
        data: {
          userid: app.globalData.userID,
          goodsid: this.data.goodsid,
          goodsnum: this.data.productNumber
        },
        success: res => {
          wx.hideLoading();
          let data = res.data;
          wx.requestPayment({
            timeStamp: data.timeStamp.toString(),
            nonceStr: data.nonceStr,
            paySign: data.paySign,
            package: data.package,
            signType: 'MD5',
            success: res => {
              if (res.errMsg == 'requestPayment:ok') {
                wx.showToast({
                  title: '购买成功',
                  image: '../../images/success.png',
                  duration: 1500
                });
                this.handleHideBuyLayer();
                wx.switchTab({
                  url: '/pages/order/order'
                });
              }
            },
            fail: res => {
              if (res.errMsg == 'requestPayment:fail cancel') {
                wx.showToast({
                  title: '取消支付',
                  image: '../../images/warning.png',
                  duration: 1500
                });
                this.handleHideBuyLayer();
              }
            }
          });
        }
      });
    }
  },

  //检查是否已收藏
  checkIsCollection(goodsid) {
    wx.request({
      url: `${api}user/check_fav`,
      data: {
        userid: app.globalData.userID,
        goodsid: goodsid
      },
      success: res => {
        if (res.data * 1 == 1) {
          this.setData({
            isCollectioned: true
          });
        } else {
          this.setData({
            isCollectioned: false
          });
        }
      }
    });
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    //保存商铺id
    this.setData({
      shopid: options.shopid,
      goodsid: options.goodsid
    });
    this.checkIsCollection(options.goodsid);
    //获取本地存储中的店铺位置
    wx.getStorage({
      key: 'distances',
      success: res => {
        Distances = res.data;
        wx.request({
          url: `${api}goods/shop_goods`,
          data: {
            shopid: options.shopid
          },
          success: res => {
            let data = res.data;
            //将距离信息添加至每个商品中
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < Distances.length; j++) {
                if (Distances[j].shopid == data[i].shopid) {
                  data[i].distances = Distances[j].distance < 1000 ? `${Distances[j].distance} m` : `${(Distances[j].distance /1000).toFixed(2)} km`;
                  break;
                } else {
                  data[i].distances = '...';
                }
              }
            }
            //将商品渲染至页面
            this.setData({
              listData: data,
              distance: data[0].distances
            });
          }
        });
      },
      fail: () => {
        wx.request({
          url: `${api}goods/shop_goods`,
          data: {
            shopid: options.shopid
          },
          success: res => {
            let data = res.data;
            //将商品渲染至页面
            this.setData({
              listData: data,
              distance: '...'
            });
          }
        });
      }
    });

    //获取店铺名称 商品名称 价格 月销 及 评分
    wx.request({
      url: `${api}goods/goods_info`,
      data: {
        goodsid: options.goodsid
      },
      success: res => {
        this.setData({
          shopName: res.data.shopname,
          goodsName: res.data.goodsname,
          price: res.data.shopprice,
          monthSum: res.data.month_sum,
          score: res.data.score,
          goodsimg: res.data.goodsimg,
          loaded: true
        });
      }
    });
    //获取店铺坐标、地址、联系方式
    wx.request({
      url: `${api}shop/shop_info`,
      data: {
        shopid: options.shopid
      },
      success: res => {
        this.setData({
          address: res.data.shopaddress,
          goodscatid: res.data.goodscatid1 * 1,
          phone: res.data.shopTel
        });
        latitude = parseFloat(res.data.latitude);
        longitude = parseFloat(res.data.longitude);
      }
    });

    //获取当前时间 设置日期范围
    let curDate = new Date();
    this.setData({
      date: formatDate(curDate),
      startDate: formatDate(curDate),
      endDate: formatDate(new Date(curDate.getTime() + 7 * 3600 * 24 * 1000))
    });

    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowHeight: res.windowHeight
        });
      }
    });
  },

  //创建动画对象
  handleCreateAnimate() {
    this.slideInDown = wx.createAnimation({
      duration: 520,
      timingFunction: 'ease'
    });
  },

  //阻止冒泡
  handleStopPropergation() {
    console.log('stop propergation');
  },

  //弹出选取优惠券层
  handlePopCoupon() {
    //创建动画
    this.handleCreateAnimate();

    //显示遮罩层
    this.setData({
      isShowGetCoupon: true
    });

    //弹出内容
    this.slideInDown.bottom(0).step();
    this.setData({
      slideInDown: this.slideInDown
    });
  },

  //隐藏选取优惠券层
  handleHideCoupon() {
    //创建动画
    this.handleCreateAnimate();

    //收起内容
    this.slideInDown.bottom(-1000).step();
    this.setData({
      slideInDown: this.slideInDown
    });

    //隐藏
    setTimeout(() => {
      this.setData({
        isShowGetCoupon: false
      });
    }, 300);
  },

  //弹出立即购买
  handlePopBuyLayer() {
    //创建动画
    this.handleCreateAnimate();

    //显示遮罩层
    this.setData({
      isShowBuyLayer: true
    });

    //弹出内容
    this.slideInDown.bottom(0).step();
    this.setData({
      slideInDown: this.slideInDown
    });
  },

  //隐藏立即购买
  handleHideBuyLayer() {
    //创建动画
    this.handleCreateAnimate();

    //收起内容
    this.slideInDown.bottom(-720).step();
    this.setData({
      slideInDown: this.slideInDown
    });

    //隐藏
    setTimeout(() => {
      this.setData({
        isShowBuyLayer: false
      });
    }, 300);
  },

  //添加商品件数
  handleAddProductNumber() {
    let curProductNumber = this.data.productNumber;
    this.setData({
      productNumber: curProductNumber + 1
    });
  },

  // 减少商品件数
  handleReduceProductNumber() {
    let curProductNumber = this.data.productNumber;
    this.setData({
      productNumber: (curProductNumber - 1) > 0 ? (curProductNumber - 1) : 1
    });
  },

  //选择日期
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  test(e) {
    console.log(e);
  },

  //跳转到店铺首页
  handleGoToShop() {
    wx.redirectTo({
      url: `../shopdetails/shopdetails?shopid=${this.data.shopid}`
    });
  },

  //列表图片发生错误
  listImgError(e) {
    let tempList = this.data.listData;
    tempList[e.currentTarget.id].goodsimg = 'Upload/goods/2017-11/5a17b5f3d2f69.jpg';
    this.setData({
      listData: tempList
    });
  },

  //定位
  handleLocation() {
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18
    });
  },

  //拨打电话
  handleMakePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    });
  },

  //收藏
  handleCollection() {
    if (allowCollection) {
      allowCollection = false;
      let interfaceUrl = this.data.isCollectioned ? 'user/fav_del' : 'goods/into_fav',
        msg = this.data.isCollectioned ? '取消成功' : '收藏成功',
        flag = this.data.isCollectioned ? false : true;
      wx.request({
        url: `${api}${interfaceUrl}`,
        data: {
          userid: app.globalData.userID,
          goodsid: this.data.goodsid
        },
        success: res => {
          if (res.data * 1 == 1) {
            this.setData({
              isCollectioned: flag
            });
            wx.showToast({
              title: msg,
              image: '../../images/success.png',
              duration: 2000
            });
            allowCollection = true;
          } else {
            wx.showToast({
              title: '网络繁忙',
              image: '../../images/warning.png',
              duration: 2000
            });
          }
        },
        fail: res => {
          wx.showToast({
            title: '网络繁忙',
            image: '../../images/warning.png',
            duration: 2000
          });
        }
      });
    }

  }
});