import listDatas from './listData';
let maxProductNumber = 1, //最大使用订单个数
  index; //当前点击使用的订单
Page({
  data: {
    productNumber: 1, //使用订单个数
    showUsed: false,
    isShowChoose: false,
    listData: [],
    useOrderStatus:1, //1表示正在加载中 2表示暂无 3表示加载完毕
    usedOrderStatus:1
  },

  onLoad() {
    let tempListData = this.data.listData;
    tempListData.push(...listDatas);

    //假设暂无已使用订单和待使用订单
    let tempUseOrderStatus = 2 ,
      tempUsedOrderStatus = 2;
    listDatas.forEach((item,index)=>{
      if(item.used){
        tempUsedOrderStatus = 3;
      }else{
        tempUseOrderStatus = 3;
      }
    });
    setTimeout(()=>{
      this.setData({
        useOrderStatus: tempUseOrderStatus,
        usedOrderStatus: tempUsedOrderStatus,
        listData: tempListData
      });
    },3000);
    
  },

  checkoutToUse() {
    this.setData({
      showUsed: false
    })
  },

  checkoutToUsed() {
    this.setData({
      showUsed: true
    })
  },

  //添加商品件数
  handleAddProductNumber() {
    let curProductNumber = this.data.productNumber;
    this.setData({
      productNumber: curProductNumber + 1 <= maxProductNumber ? curProductNumber + 1 : maxProductNumber
    })
  },

  // 减少商品件数
  handleReduceProductNumber() {
    let curProductNumber = this.data.productNumber;
    this.setData({
      productNumber: (curProductNumber - 1) > 0 ? (curProductNumber - 1) : 1
    })
  },

  // 阻挡默认事件
  isStopPropergation() {
    console.log('stop propergation');
  },

  //关闭弹唱
  handleClosePop() {
    this.setData({
      isShowChoose: false,
      productNumber: 1
    });
  },

  //使用订单
  handleUseOrder() {
    /**
     * 这里向后台发送数据 并等待后台返回成功标识
     */

    //记录数据
    let curOrder = this.data.listData[index],
      num = this.data.productNumber;
    //关闭弹窗
    this.handleClosePop();
    //页面跳转
    wx.navigateTo({
      url: '../usesuccess/usesuccess?uniquekey=' + curOrder.uniquekey + '&num=' + num
    })
  },

  //点击评价或立即使用
  evaluateOrUse(e) {
    index = Number(e.currentTarget.id);
    let curOrder = this.data.listData[index];
    if (curOrder.used) { //评价
      wx.navigateTo({
        url: '../evaluate/evaluate?uniquekey=' + curOrder.uniquekey
      })
    } else { //使用
      //如果订单个数大于1 显示选取使用数量的弹窗
      if (curOrder.total > 1) {
        //记录当前订单的最大使用个数
        maxProductNumber = curOrder.total;
        this.setData({
          isShowChoose: true
        });
      } else {
        wx.navigateTo({
          url: '../usesuccess/usesuccess?uniquekey=' + curOrder.uniquekey + '&num=' + 1
        })
      }
    }

  }
})