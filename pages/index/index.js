//index.js
//获取应用实例
const app = getApp(),
  api = app.globalData.api,
  imgUrl = app.globalData.imgUrl;
import { chooseAddress, getAddress } from './address';
import listDatas from './listData';

let tagNavTop = 0; //标签导航距离顶部的距离

let allLoadMore = true, //允许加载更多
  currentPageNum = 1, //当前加载的次数
  countPageNum = 5; //共可以加载的次数

Page({
  data: {
    windowWidth: 750, //视口宽度
    windowHeight: 500,
    swiperHeight: 150, //swiper 高度
    address: '',

    tagNavFixed: false, //标签导航是否吸顶

    isLastPage: false, //是否加载完所有的次数
    listData: [],

    carousel: {
      imagesUrl: ['../../images/banner-1.png', '../../images/banner-2.png'],
      indicatorDots: true, //是否显示焦点
      indicatorColor: '#eeeeee', //焦点颜色
      indicatorActiveColor: '#333333', //当前活动块焦点颜色
      autoplay: true, //自动播放
      interval: 4000, //自动播放间隔市场
      circular: true //无缝衔接
    }
  },

  onShow() {

  },

  //获取热门推荐数据
  getGoodsList() {
    wx.request({
      url: `${api}goods/goodslist?recom=1&$listtype=1&p=1`,
      data:{
        recom:1,
        listtype:1,
        p:currentPageNum
      },
      success: res => {
        //保存最大加载次数
        countPageNum = res.data.page_sum;
        // console.log(res)
      }
    })
    //更改列表信息
    let tempList = this.data.listData;
    tempList.push(...listDatas);
    this.setData({
      listData: tempList
    });
  },

  onLoad(options) {

    if (options.scene) {
      console.log(options.scene)
    }
    //获取地址
    getAddress(this, app);

    //初始化标签导航
    this.initTagNavTop();

    //获取热门推荐数据
    this.getGoodsList();

    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      }
    });
  },

  //跳转到搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '../search/search'
    })
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

  //地址选取事件
  handleChooseAddress() {
    let self = this;
    // 点击选择按钮之后打开地图选择地址
    wx.getLocation({
      type: 'wgs84',
      // 如果成功 直接选择地址
      success: res => {
        chooseAddress(self, app);
      },
      // 如果选择失败 打开设置 重新授权
      fail: res => {
        wx.openSetting();
      }
    })
  },

  //页面滚动事件
  handleScroll(e) {
    if (e.detail.scrollTop > tagNavTop) {
      this.setData({
        tagNavFixed: true
      })
    } else {
      this.setData({
        tagNavFixed: false
      })
    }
  },

  // 初始化标签导航
  initTagNavTop() {
    let self = this;
    let query = wx.createSelectorQuery();
    query.select('.tag-nav').boundingClientRect();
    query.exec(res => {
      tagNavTop = res[0].top;
    });
  },

  //下拉加载更多
  handleSscrollToLower() {
    let self = this;
    //如果当前页面不是最后一页
    if (currentPageNum < countPageNum) {
      if (allLoadMore) {
        allLoadMore = false;
        currentPageNum++;
        setTimeout(function() {

          //更改列表信息
          let tempList = self.data.listData;
          tempList.push(...listDatas);
          self.setData({
            listData: tempList
          });

          allLoadMore = true;
        }, 2000);
      }
    } else {
      this.setData({
        isLastPage: true
      })
    }
  },

  //分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '西峡派 -- ' + app.globalData.appDescription,
      path: '/pages/index/index',
      success() {
        console.log('success');
      },
      fail() {
        console.log('fail');
      }
    }
  }
})