// pages/components/shopdetail/shopdetails.js
import ListDatas from './listData';
import { formatDate } from '../../utils/util';

let slideInDown;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    listData: []
  },


  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    console.log(options);
    //获取列表信息
    let tempListData = this.data.listData;
    tempListData.push(...ListDatas);
    this.setData({
      listData: tempListData
    });

    wx.setNavigationBarTitle({
      title: '店铺名称'
    })
  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {

  }

})