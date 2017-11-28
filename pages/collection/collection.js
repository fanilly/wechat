import listDatas from './listData';
const app = getApp(),
  api = app.globalData.api;
Page({
  data: {
    listData: []
  },
  onLoad: function(options) {
    this.getCollecitonList();
  },
  onShow() {
    this.getCollecitonList();
  },
  getCollecitonList() {
    wx.request({
      url: `${api}user/favourite`,
      data: {
        userid: app.globalData.userID
      },
      success: res => {
        this.setData({
          listData: res.data
        });
        wx.getStorage({
          key: 'distances',
          success: res => {
            let Distances = res.data,
              data = this.data.listData;
            //添加距离属性
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
            this.setData({
              listData: data
            });
          }
        });
      }
    });
  }
})