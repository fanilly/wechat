import listDatas from './listData';
Page({
  data: {
    showUsed: false,
    listData: []
  },
  onLoad() {
    let tempListData = this.data.listData;
    tempListData.push(...listDatas);
    this.setData({
      listData: tempListData
    })
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
  }
})