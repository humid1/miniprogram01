/**
 * 1.页面加载的时候
 *    从缓存中获取购物车数据，渲染到页面中
 *    这些数据 checked = true 进行过滤
 * 2.微信支付
 *    哪些人，哪些账号 可以实现微信支付
 *      企业账号
 *        企业账号的小程序后台，必须给开发者添加白名单
 *        一个 appid 可以同时绑定多个 开发者，这些开发这就可以共用这个 appid 和 开发权限
 * 3.支付按钮
 *    先判断缓存中有没有token
 *      没有 跳转到授权页面，进行获取 token
 *      有        
 *    
 */
import { getSetting,openSetting,chooseAddress,showModal,showToast } from '../../utils/asyncWx';
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 获取微信缓存中的数据（生产环境是获取后台数据） 
   */
  onShow() {
    // 1.获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 2.获取缓存中的商品数据
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter( v => v.checked)
    // 3.把值设置到 data 中

    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    // 给data赋值
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    })
  },
  // 点击支付按钮的功能
  async handleOrderPay() {
    // 1.判断缓存中有没有 token
    const token = wx.getStorageSync('token');
    // 2.判断是否存在
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    } else {
      // 存在 token
    }
  }
})