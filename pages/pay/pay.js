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
 *      有token，创建订单，获取订单编号
 *    完成微信支付
 *    手动删除缓存中，已经被选中了的商品
 *    删除后的购物车数据，重新覆盖原来的缓存数据
 *    跳转到订单页面       
 *    
 */
import request from '../../request/index'
import { getSetting,openSetting,chooseAddress,showModal,showToast,requestPayment } from '../../utils/asyncWx';
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
    try {
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
        console.log("存在token");
      }
      // 3.创建订单
      //  3.1 准备请求头参数
      // const header = {Authorization: token};

      //  3.2 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach( v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price 
      }))
      const dataParams = {order_price,consignee_addr,goods}
      // 4.发送请求，创建订单，获取订单编号
      const {data: res} = await request({ 
        url: '/my/orders/create',
        method: 'post',
        data: dataParams
      })
      // 获取订单编号
      const {order_number} = res.data;
      // 5.发起 预支付接口
      const {data: res} = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'post',
        data: {order_number}
      })
      // 后台返回的值包含 timeStamp nonceStr timeStamp package signType
      // 6.发起微信支付
      await requestPayment(res.pay)
      // 7.查询后台 订单状态
      await request({
        url: '/my/orders/chkOrder',
        method: 'post',
        data: {order_number}
      })
      await showToast({title: '支付成功！'});
      // 8.删除缓存中，已经支付的商品
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter( v => !v.checked);
      wx.getStorageSync('cart', newCart);

      // 9.支付成功，跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order'
      })
    } catch(err) {
      await showToast({title: '支付失败！' + err});
    }
  }
})
  