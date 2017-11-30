const app = getApp(),
  api = app.globalData.api,
  imgUrl = app.globalData.imgUrl;

let Distances = [], //缓存中的距离问题
  tagNavTop = 0, //标签导航距离顶部的距离
  allLoadMore = true, //允许加载更多
  currentPageNum = 1, //当前加载的次数
  countPageNum = 5, //共可以加载的次数
  listtype = 1, //当前显示内容的排序方式
  listDatas = []; //保存距离排序时的列表信息

Page({
  data: {
    windowWidth: 750, //视口宽度
    windowHeight: 500,
    swiperHeight: 150, //swiper 高度
    address: '',
    tagNavFixed: false, //标签导航是否吸顶

    isLastPage: false, //是否加载完所有的次数
    listData: [],
    isDistanceSort: false, //当前是否是以距离排序

    carousel: {
      imagesUrl: ['../../images/banner-1.png', '../../images/banner-2.png'],
      indicatorDots: true, //是否显示焦点
      indicatorColor: '#eeeeee', //焦点颜色
      indicatorActiveColor: 'rgba(0,0,0,.5)', //当前活动块焦点颜色
      autoplay: true, //自动播放
      interval: 4000, //自动播放间隔市场
      circular: true //无缝衔接
    }
  },


  //获取热门推荐数据
  getGoodsList() {
    wx.request({
      url: `${api}goods/goodslist`,
      data: {
        recom: 1,
        listtype: listtype,
        p: currentPageNum
      },
      success: res => {
        console.log(res);
        //保存最大加载次数
        countPageNum = res.data.page_sum;

        let tempList = this.data.listData,
          goodslist = res.data.goodslist;

        //如果已经获取到距离信息 将距离信息添加至每个商品中
        if (Distances.length != 0) {
          for (let i = 0; i < goodslist.length; i++) {
            for (let j = 0; j < Distances.length; j++) {
              if (Distances[j].shopid == goodslist[i].shopid) {
                goodslist[i].distances = Distances[j].distance < 1000 ? `${Distances[j].distance} m` : `${(Distances[j].distance /1000).toFixed(2)} km`;
                break;
              } else {
                goodslist[i].distances = '...';
              }
            }
          }
        }

        //更改列表信息
        tempList.push(...goodslist);
        this.setData({
          listData: tempList
        });

        //修改加载状态
        allLoadMore = true;
      }
    })
  },

  onLoad(options) {
    console.log(options);
    if (options.scene) {
      console.log(options.scene)
    }

    //获取缓存中的距离
    wx.getStorage({
      key: 'distances',
      success: res => {
        Distances = res.data;
      },
      fail: function() {
        Distances = [];
      }
    })

    this.getAddress(); //获取地址
    this.initTagNavTop(); //初始化标签导航
    this.getGoodsList(); //获取热门推荐数据

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

  //banner图片加载
  imageLoad(e) {
    //获取图片真实宽度  
    let imgwidth = e.detail.width,
      imgheight = e.detail.height,
      swiperHeight = this.data.windowWidth / imgwidth * imgheight;
    this.setData({
      swiperHeight: swiperHeight
    })
  },

  //列表图片发生错误
  listImgError(e) {
    let tempList = this.data.listData;
    tempList[e.currentTarget.id].goodsimg = 'Upload/goods/2017-11/5a17b5f3d2f69.jpg';
    this.setData({
      listData: tempList
    })
  },

  //地址选取事件
  handleChooseAddress() {
    // 点击选择按钮之后打开地图选择地址
    wx.getLocation({
      type: 'wgs84',
      // 如果成功 直接选择地址
      success: res => {
        this.chooseAddress();
      },
      // 如果选择失败 打开设置 重新授权
      fail: res => {
        wx.openSetting({
          success: res => {
            if (res.authSetting['scope.userLocation']) {
              this.chooseAddress();
            }
          }
        });
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
        //如果listtype等于3 代表当前为距离排序
        if (listtype == 3)
          this.getDistanceList();
        else
          this.getGoodsList();
      }
    } else {
      this.setData({
        isLastPage: true
      })
    }
  },

  //分享
  onShareAppMessage(res) {
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
  },

  //选取地址
  chooseAddress() {
    wx.chooseLocation({
      success: res => {
        wx.setStorage({
          key: 'address',
          data: res.name != '' ? res.name : res.address
        });
        app.globalData.address = res.name;
        this.setData({
          address: res.name
        });
        this.saveDistance(res.latitude, res.longitude);
      }
    })
  },

  //获取定位
  getAddress() {
    wx.getLocation({
      type: 'wgs84',
      success: res => { //成功获取位置
        /**
         * 如果可以获取到地址 将获取到的地址保存入storage中
         * 否则打开地址选取页面
         */
        this.saveDistance(res.latitude, res.longitude);
        wx.getStorage({
          key: 'address',
          success: res => {
            app.globalData.address = res.data;
            this.setData({
              address: res.data
            })
          },
          fail: () => {
            this.chooseAddress();
          }
        })
      }
    });
  },

  //保存距离
  saveDistance(latitude, longitude) {
    wx.request({
      url: `${app.globalData.api}common/ext_distance?start=${latitude},${longitude}`,
      success: res => {
        Distances = res.data;
        this.addDistancesToGoodslist();
        if (this.data.isDistanceSort) this.distanceSort();
        //获取位置成功 保存入本地存储
        wx.setStorage({
          key: 'distances',
          data: res.data
        });
      }
    })
  },

  //给商品列表添加距离属性
  addDistancesToGoodslist() {
    let tempList = this.data.listData;
    //如果已经获取到距离信息 将距离信息添加至每个商品中
    if (Distances.length != 0) {
      for (let i = 0; i < tempList.length; i++) {
        for (let j = 0; j < Distances.length; j++) {
          if (Distances[j].shopid == tempList[i].shopid) {
            tempList[i].distances = Distances[j].distance < 1000 ? `${Distances[j].distance} m` : `${(Distances[j].distance /1000).toFixed(2)} km`
            break;
          } else {
            tempList[i].distances = '...';
          }
        }
      }
    }
    //更改列表信息
    this.setData({
      listData: tempList
    });
  },

  //商品列表排序排序
  sortGoodsList(num) {
    this.setData({
      listData: [],
      isDistanceSort: false
    });
    allLoadMore = true;
    listtype = num;
    currentPageNum = 1;
    this.getGoodsList();
  },

  //综合排序
  handleComprehensiveSort() {
    this.sortGoodsList(1);
  },

  //销量排序
  handleSalesSort() {
    this.sortGoodsList(2);
  },

  //距离排序时每次加载执行
  getDistanceList() {
    let tempList = this.data.listData;
    for (let i = (currentPageNum - 1) * 8; i < currentPageNum * 8; i++) {
      tempList.push(listDatas[i]);
    }

    //更改列表信息
    this.setData({
      listData: tempList
    });

    setTimeout(() => {
      allLoadMore = true; //修改加载状态
    }, 350);
  },

  //距离排序
  distanceSort() {
    allLoadMore = true;
    currentPageNum = 1;
    listtype = 3;
    wx.request({
      url: `${api}goods/goodslist`,
      data: {
        recom: 1,
        listtype: listtype
      },
      success: res => {
        let data = res.data;
        if (data.length != 0) {
          //为商品列表的每一个列表项添加距离属性
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < Distances.length; j++) {
              if (Distances[j].shopid == data[i].shopid) {
                data[i].distances = Distances[j].distance < 1000 ? `${Distances[j].distance} m` : `${(Distances[j].distance /1000).toFixed(2)} km`
                data[i].sortFlag = Distances[j].distance;
                break;
              } else {
                data[i].distances = '...';
                data[i].sortFlag = 50000;
              }
            }
          }
          //查找排序法
          for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
              if (data[i]['sortFlag'] > data[j]['sortFlag']) {
                let tempItem = data[i];
                data[i] = data[j];
                data[j] = tempItem;
              }
            }
          }
          //保存列表信息
          listDatas = data;
          countPageNum = Math.ceil(data.length / 8);
          this.getDistanceList();
        }
      }
    });
  },

  // 距离排序
  handleDistanceSort() {
    this.setData({
      isDistanceSort: true,
      listData:[]
    });
    if (!this.data.address) {
      //显示模态框
      wx.showModal({
        title: '温馨提示',
        content: '必须选取位置之后才能进行位置排序！',
        cancelText: '忽略',
        confirmText: '选择',
        success: res => {
          if (res.confirm) { //如果点击确定
            this.handleChooseAddress();
          }
        }
      });
    } else {
      this.distanceSort();
    }
  },

  //价格排序
  handlePriceSort() {
    this.sortGoodsList(4);
  }

});