/**
 * @Author:      allenAugustine
 * @Email:       iallenaugustine@gmail.com  -  misterji0708@qq.com
 * @DateTime:    2017-11-25 11:27:08
 * @Description: 更新后台保存的用户信息
 * @param  {[Object]} userInfo [新获取到的用户信息]
 * @param  {[String]} api      [后台api根路径]
 * @param  {[String]} userID      [用户唯一值]
 */

module.exports = (userInfo, api, userID) => {
  const update = (userInfo, api, userID) => {
    wx.request({
      method: 'POST',
      url: `${api}user/modify_info`,
      data: {
        userID: userID,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
        nickName: userInfo.nickName,
        language: userInfo.language,
        country: userInfo.country,
        province: userInfo.province,
        city: userInfo.city
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });
  };
  wx.getStorage({
    key: 'userInfo',
    success: res => {
      //如果本次获取的信息与storage中的信息不匹配
      //将信息传输的后台
      let data = res.data;
      // if (data.avatarUrl != userInfo.avatarUrl || data.gender != userInfo.gender || data.nickName != userInfo.nickName || data.language != userInfo.language || data.country != userInfo.country || data.province != userInfo.province || data.city != userInfo.city) {
        wx.setStorage({
          key: 'userInfo',
          data: {
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender,
            nickName: userInfo.nickName,
            language: userInfo.language,
            country: userInfo.country,
            province: userInfo.province,
            city: userInfo.city
          }
        });
        update(userInfo, api, userID);
      // }
    },
    fail() {
      //将头像昵称保存入storage
      wx.setStorage({
        key: 'userInfo',
        data: {
          avatarUrl: userInfo.avatarUrl,
          gender: userInfo.gender,
          nickName: userInfo.nickName,
          language: userInfo.language,
          country: userInfo.country,
          province: userInfo.province,
          city: userInfo.city
        }
      });
      update(userInfo, api, userID);
    }
  });
};
