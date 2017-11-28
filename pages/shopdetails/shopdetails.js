// pages/components/shopdetail/shopdetails.js
import { formatDate } from '../../utils/util';

const app = getApp(),
  api = app.globalData.api;

let slideInDown,
  latitude, //店铺所在位置的纬度
  longitude, //店铺所在位置的经度
  Distances;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '', //地址
    phone: '', //联系方式
    monthSum: '', //月销
    score: '', //评分
    shopImg: '', //海报
    shopName: '', //店铺名称
    distance: '', //距离
    listData: []
  },


  // 生命周期函数--监听页面加载
  onLoad: function(options) {

    //获取本地存储中的店铺位置
    wx.getStorage({
      key: 'distances',
      success: res => {
        Distances = res.data;
        wx.request({
          url: `${api}goods/shop_goods`,
          data: {
            shopid: options.shopid
          },
          success: res => {
            console.log(res)
            let data = res.data;
            //将距离信息添加至每个商品中
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < Distances.length; j++) {
                if (Distances[j].shopid == data[i].shopid) {
                  data[i].distances = Distances[j].distance < 1000 ? `${Distances[j].distance} m` : `${(Distances[j].distance /1000).toFixed(2)} km`
                  break;
                } else {
                  data[i].distances = '...';
                }
              }
            }
            //将商品渲染至页面
            this.setData({
              listData: data,
              distance: data[0].distances
            });
          }
        });
      },
      fail: function() {
        Distances = [];
      }
    });

    //获取店铺坐标、地址、联系方式
    wx.request({
      url: `${api}shop/shop_info`,
      data: {
        shopid: options.shopid
      },
      success: res => {
        let data = res.data;
        wx.setNavigationBarTitle({
          title: data.shopname
        });
        this.setData({
          address: data.shopaddress,
          phone: data.shoptel,
          monthSum: data.month_sum,
          score: data.score,
          shopImg: data.shopImg,
          shopName: data.shopname
        });
        latitude = parseFloat(data.latitude);
        longitude = parseFloat(data.longitude);
      }
    });

  },

  //定位
  handleLocation() {
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18
    })
  },

  //拨打电话
  handleMakePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone //仅为示例，并非真实的电话号码
    })
  }

})