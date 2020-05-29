// pages/login/login.js
Page({
  // 获取用户信息
  handleGetUserInfo(e) {
    const {userInfo} = e.detail;
    // 存入到缓存数据中
    wx.setStorageSync("userinfo", userInfo);
  }
})