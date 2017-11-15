import listDatas from './listData';

Page({
  data: {
    listData: []
  },
  onLoad: function(options) {
  	var tempListData = this.data.listData;
  	tempListData.push(...listDatas);
    this.setData({
      listData: tempListData
    })
  },
})