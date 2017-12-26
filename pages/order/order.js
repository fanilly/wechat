import updateUserInfo from '../../utils/updateuserinfo';
const app = getApp(),
  api = app.globalData.api;
let maxProductNumber = 1, //最大使用订单个数
  index; //当前点击使用的订单
Page({
  data: {
    productNumber: 1, //使用订单个数
    showUsed: false,
    isShowChoose: false,
    listData: [],
    useOrderStatus: 1, //1表示正在加载中 2表示暂无 3表示加载完毕
    usedOrderStatus: 1,
    showPage: false //是否显示页面
  },

  onLoad() {
    this.checkoutToUse();
    if (!app.globalData.userInfo) {
      this.login();
    } else {
      this.setData({
        showPage: true
      });
    }
  },

  onShow() {
    if (this.data.showUsed) {
      this.checkoutToUsed();
    }
    if (!this.data.showUsed) {
      this.checkoutToUse();
    }
    if (!app.globalData.userInfo) {
      this.login();
    } else {
      this.setData({
        showPage: true
      });
    }
  },

  //切换至待使用订单
  checkoutToUse() {
    this.setData({
      listData: [],
      showUsed: false,
      useOrderStatus: 1,
    });
    wx.request({
      url: `${api}order/orderlist`,
      data: {
        userid: app.globalData.userID
      },
      success: res => {
        if (!res.data) {
          this.setData({
            useOrderStatus: 2
          });
        } else {
          this.setData({
            listData: res.data,
            useOrderStatus: 3
          });
        }
      }
    });
  },

  //切换至已使用订单
  checkoutToUsed() {
    this.setData({
      listData: [],
      showUsed: true,
      usedOrderStatus: 1
    });
    wx.request({
      url: `${api}order/orderlist_old`,
      data: {
        user_id: app.globalData.userID
      },
      success: res => {
        if (!res.data) {
          this.setData({
            usedOrderStatus: 2
          });
        } else {
          this.setData({
            listData: res.data,
            usedOrderStatus: 3
          });
        }
      }
    });
  },

  //添加商品件数
  handleAddProductNumber() {
    let curProductNumber = this.data.productNumber;
    this.setData({
      productNumber: curProductNumber + 1 <= maxProductNumber ? curProductNumber + 1 : maxProductNumber
    });
  },

  // 减少商品件数
  handleReduceProductNumber() {
    let curProductNumber = this.data.productNumber;
    this.setData({
      productNumber: (curProductNumber - 1) > 0 ? (curProductNumber - 1) : 1
    });
  },

  // 阻挡默认事件
  isStopPropergation() {
    console.log('stop propergation');
  },

  //关闭弹窗
  handleClosePop() {
    this.setData({
      isShowChoose: false,
      productNumber: 1
    });
  },

  //向后台发送使用订单请求
  userOrder(num, orderid, goodsname, shopname) {
    wx.showModal({
      title: '温馨提示',
      content: '是否确认使用订单？',
      success: res => {
        if (res.confirm) {
          wx.showLoading();
          console.log(num, app.globalData.userID, orderid);
          wx.request({
            url: `${api}buy/use_order`,
            data: {
              goodsnum: num,
              userid: app.globalData.userID,
              orderid: orderid
            },
            success: res => {
              console.log(res)
              wx.hideLoading();
              if (res.data * 1 == 0) {
                wx.showToast({
                  title: '使用失败',
                  image: '../../images/warning.png',
                  duration: 1500
                });
              } else {
                // 关闭弹窗
                this.handleClosePop();
                wx.navigateTo({
                  url: `../usesuccess/usesuccess?orderid=${res.data.orderid}&time=${res.data.time}&num=${num}&id=${res.data.id}&goodsname=${goodsname}&shopname=${shopname}`
                });
              }
            }
          });
        } else {
          this.setData({
            productNumber: 1
          });
        }
      }
    });
  },

  //使用订单
  handleUseOrder() {
    let curOrder = this.data.listData[index],
      num = this.data.productNumber || 1;
    this.userOrder(num, curOrder.orderid, curOrder.goodsname, curOrder.shopname);
  },

  //点击评价或立即使用
  evaluateOrUse(e) {
    index = Number(e.currentTarget.id);
    let curOrder = this.data.listData[index];
    if (this.data.showUsed) { //评价
      if (curOrder.appraise_status * 1 == 1) { //已评价
        wx.showToast({
          title: '无法重复评价',
          image: '../../images/warning.png',
          duration: 1500
        });
      } else { //去评价
        wx.navigateTo({
          url: `../evaluate/evaluate?id=${curOrder.id}`
        });
      }
    } else { //使用
      //如果订单个数大于1 显示选取使用数量的弹窗
      let total = parseInt(curOrder.goodsnums);
      if (total > 1) {
        //记录当前订单的最大使用个数
        maxProductNumber = total;
        this.setData({
          isShowChoose: true
        });
      } else {
        this.userOrder(total, curOrder.orderid, curOrder.goodsname, curOrder.shopname);
      }
    }
  },

  //删除订单和退款
  handleDeleteOrRefundOrder(e) {
    index = Number(e.currentTarget.id);
    let curOrder = this.data.listData[index];
    if (this.data.showUsed) { //删除订单
      wx.showLoading();
      wx.request({
        //必需
        url: `${api}order/order_del`,
        data: {
          id: curOrder.id
        },
        success: res => {
          wx.hideLoading();
          if (res.data) {
            wx.showToast({
              title: '删除成功',
              image: '../../images/success.png',
              duration: 1500
            });
            this.checkoutToUsed();
          }
        }
      });
    } else { //退款
      wx.showModal({
        title: '温馨提示',
        content: '如果进行退款，商家将收取10%手续费，您确认要退款吗？',
        success: res => {
          if (res.confirm) {
            wx.showLoading();
            //向服务器发送退款请求
            wx.request({
              url: `${api}buy/tuikuan?orderId=${curOrder.orderid}&userId=${app.globalData.userID}`,
              success: res => {
                console.log(res);
                wx.hideLoading();
                if (res.data * 1 == 0) {
                  wx.showModal({
                    title: '温馨提示',
                    content: '退款失败'
                  });
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: '退款成功，退款金额将在24小时之内返还您的账户？',
                    success: res => {
                      this.checkoutToUse();
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  },

  //登陆
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
          showPage: true
        });
        updateUserInfo(app.globalData.userInfo, api, app.globalData.userID);
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
});