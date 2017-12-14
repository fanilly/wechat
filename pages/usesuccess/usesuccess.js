// pages/usesuccess/usesuccess.js
import {formatTime} from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(options) {
    let tempDatas = {
      goodsname:options.goodsname,
      shopname:options.shopname,
      orderid:options.orderid,
      id:options.id,
      num:options.num,
      time:formatTime(new Date(options.time*1000))
    };
    this.setData({
      datas: tempDatas
    });
  }
});