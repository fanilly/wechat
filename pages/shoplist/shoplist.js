//获取应用实例
const app = getApp();
import listDatas from './listData';

let tagNavTop = 0; //标签导航距离顶部的距离

let allLoadMore = true, //允许加载更多
  currentPageNum = 1, //当前加载的次数
  countPageNum = 5; //共可以加载的次数


Page({
  data: {
    windowWidth: 750, //视口宽度
    windowHeight: 500,

    tagNavFixed: false, //标签导航是否吸顶
    isLastPage: false, //是否加载完所有的次数
    listData: []
  },

  onShow() {

  },

  onLoad() {
    //初始化标签导航
    this.initTagNavTop();

    //更改列表信息
    let tempList = this.data.listData;
    tempList.push(...listDatas);
    this.setData({
      listData: tempList
    });

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


  //页面滚动事件
  handleScroll(e) {
  	//实现导航吸顶
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
    if (currentPageNum != countPageNum) {
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
  }
})