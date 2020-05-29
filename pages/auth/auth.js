import { showToast,login } from '../../utils/asyncWx';
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from '../../request/index'
// pages/auth/auth.js
Page({
  // 获取用信息
  async handleGetUserInfo(e) {
    // 模拟操作-直接设置 token
    wx.setStorageSync('token', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
    return;

    console.log(e);
    // e.detail内的参数
    // cloudID  encryptedData errMsg iv rawData signature userInfo
    // 1.获取用户信息
    const {encryptedData,rawData,iv,signature} = e.detail;
    // 2.获取小程序登录成功后的 code
    const {code} = await login();
    console.log(code);
    
    const loginParams = {encryptedData, rawData, iv, signature, code}
    // 3.发送请求，获取用户的token
    const { data: res } = await request({
      url: '/users/wxlogin',
      method: 'post',
      data: loginParams
    })
    
    if(res.meta.status === 200) {
      const {token} = res.message;
      // 4.把 token 存入缓存中，同时跳转回上一个页面
      wx.setStorageSync('token', token);
      wx.navigateBack({
        delta: 1
      });
    } else {
      await showToast({title: '授权失败！'})
    }
  }
})