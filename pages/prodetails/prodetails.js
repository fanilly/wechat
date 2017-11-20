// pages/components/prodetail/prodetails.js
import ListDatas from './listData';
import { formatDate } from '../../utils/util';

let slideInDown;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allowScroll: false, //是否允许页面层滚动
    windowHeight: 750, //视口高度
    productNumber: 1, //商品件数
    isHotel: true, //是否是酒店
    date: '2016-09-01', //当前选择时间
    startDate: '', //开始时间
    endDate: '',

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
    }, {
      shopuniquekey: 'xx21255',
      shopname: '一乐拉面',
      denomination: 10,
      activityname: '店铺名称',
      invaliddate: '2017-11-12',
      fullcut: 100
    }, {
      shopuniquekey: 'xx21255',
      shopname: '一乐拉面',
      denomination: 10,
      activityname: '店铺名称',
      invaliddate: '2017-11-12',
      fullcut: 100
    }]
  },


  // 生命周期函数--监听页面加载
  onLoad: function(options) {

    console.log(options)

    let curDate = new Date();
    this.setData({
      date: formatDate(curDate),
      startDate: formatDate(curDate),
      endDate: formatDate(new Date(curDate.getTime() + 7 * 3600 * 24 * 1000))
    });

    //获取列表信息
    let tempListData = this.data.listData;
    tempListData.push(...ListDatas);
    this.setData({
      listData: tempListData
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
  handleCreateAnimate(){
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
      })
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
  handleHideBuyLayer(){
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
      })
    }, 300);
  },

  //添加商品件数
  handleAddProductNumber() {
    let curProductNumber = this.data.productNumber;
    this.setData({
      productNumber: curProductNumber + 1
    })
  },

  // 减少商品件数
  handleReduceProductNumber() {
    let curProductNumber = this.data.productNumber;
    this.setData({
      productNumber: (curProductNumber - 1) > 0 ? (curProductNumber - 1) : 1
    })
  },

  //选择日期
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  test(e){
    console.log(e)
  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {

  }

})